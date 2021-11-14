export default (
  devAddress: string,
  nftAddress: string,
  fungibleTokenAddress: string,
  flowTokenAddress: string,
) =>
`
import FungibleToken from ${fungibleTokenAddress}
import NonFungibleToken from ${nftAddress}
import FlowToken from ${flowTokenAddress}
import OpenSpaceItems from ${devAddress}
import OpenSpaceAdminNFTStorefront from ${devAddress}

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
