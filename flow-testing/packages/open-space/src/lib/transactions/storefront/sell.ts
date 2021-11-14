import {
  wrapUInt64Array,
  CONSTANTS,
  FlowAccount,
  wrapUFix64,
  wrapString,
  wrapObjects,
} from '@flow-testing/flow-testing-utils'

const SELL_OPEN_SPACE_ITEM = (adminAddress: string) => `
import FungibleToken from ${CONSTANTS.FUNGIBLE_TOKEN_ADDRESS}
import NonFungibleToken from ${CONSTANTS.NON_FUNGIBLE_TOKEN_ADDRESS}
import FlowToken from ${CONSTANTS.FLOW_TOKEN_ADDRESS}
import OpenSpaceItems from ${adminAddress}
import OpenSpaceAdminNFTStorefront from ${adminAddress}

transaction(
  setID: String,
  packID: String,
  price: UFix64, 
  metadatas: [{String:String}],
  beneficiaryAddress: Address, 
  beneficiaryPercent: UFix64
) {

  let adminFLOWWallet: Capability<&FlowToken.Vault{FungibleToken.Receiver}>
  let beneficiaryFLOWWallet: Capability<&FlowToken.Vault{FungibleToken.Receiver}>
  let storefront: &OpenSpaceAdminNFTStorefront.Storefront

  prepare(acct: AuthAccount) {
      assert(beneficiaryPercent >= 0.0 && beneficiaryPercent <= 1.0, message: "Invalid beneficiary percentage sale cut.")
      let beneficiary = getAccount(beneficiaryAddress)

      self.adminFLOWWallet = acct.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)!
      assert(self.adminFLOWWallet.borrow() != nil, message: "Missing or mis-typed FlowToken receiver for admin")

      self.beneficiaryFLOWWallet = beneficiary.getCapability<&FlowToken.Vault{FungibleToken.Receiver}>(/public/flowTokenReceiver)!
      assert(self.beneficiaryFLOWWallet.borrow() != nil, message: "Missing or mis-typed FlowToken receiver for beneficiary")

      self.storefront = acct.borrow<&OpenSpaceAdminNFTStorefront.Storefront>(from: OpenSpaceAdminNFTStorefront.StorefrontStoragePath)
          ?? panic("Missing or mis-typed OpenSpaceAdminNFTStorefront Storefront")
  }

  execute {
    let adminFLOWCut = OpenSpaceAdminNFTStorefront.SaleCut(
      receiver: self.adminFLOWWallet,
      amount: price * (1.0 - beneficiaryPercent)
    )
    let beneficiaryFLOWCut = OpenSpaceAdminNFTStorefront.SaleCut(
        receiver: self.beneficiaryFLOWWallet,
        amount: price * beneficiaryPercent
    )
    let flowTokenPaymentOption = OpenSpaceAdminNFTStorefront.PaymentOption(
        salePaymentVaultType: Type<@FlowToken.Vault>(),
        saleCuts: [adminFLOWCut, beneficiaryFLOWCut]
    )
    self.storefront.createListing(
      setID: setID,
      packID: packID,
      metadatas: metadatas,
      paymentOptions: [flowTokenPaymentOption]
    )
  }
}
`

export const sellOpenSpaceItem = async (
  admin: FlowAccount,
  user: FlowAccount,
  setId: string,
  packId: string,
  price: number,
  cut: number,
  metadatas: Record<string, string>[]
) => {
  return await admin.sendTx({
    transaction: SELL_OPEN_SPACE_ITEM(admin.getAddress()),
    args: [
      wrapString(setId),
      wrapString(packId),
      wrapUFix64(price),
      wrapObjects(metadatas),
      user.getAddress(true),
      wrapUFix64(cut),
    ],
  })
}
