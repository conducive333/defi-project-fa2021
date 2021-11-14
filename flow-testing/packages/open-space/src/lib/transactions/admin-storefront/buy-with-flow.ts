import {
  CONSTANTS,
  FlowAccount,
  wrapString,
  wrapUInt64,
} from '@flow-testing/flow-testing-utils'

const BUY_ADMIN_LISTING_WITH_FLOW = (adminAddress: string) => `
import FungibleToken from ${CONSTANTS.FUNGIBLE_TOKEN_ADDRESS}
import NonFungibleToken from ${CONSTANTS.NON_FUNGIBLE_TOKEN_ADDRESS}
import FlowToken from ${CONSTANTS.FLOW_TOKEN_ADDRESS}
import OpenSpaceItems from ${adminAddress}
import OpenSpaceVoucher from ${adminAddress}
import OpenSpaceAdminNFTStorefront from ${adminAddress}

pub fun findAvailableListing(
  storefront: &OpenSpaceAdminNFTStorefront.Storefront{OpenSpaceAdminNFTStorefront.StorefrontPublic},
  setID: String
): &OpenSpaceAdminNFTStorefront.Listing{OpenSpaceAdminNFTStorefront.ListingPublic} {
  let setListings = storefront.borrowListings(setID: setID)
  if setListings != nil {
    for packID in setListings!.keys {
      let listing = storefront.borrowListing(setID: setID, packID: packID)!
      let details = listing.getDetails()
      if (!listing.getDetails().purchased) {
        return listing
      }
    }
    panic("No packs available for purchase")
  }
  panic("Set ID does not exist")
}

pub fun findValidPaymentOption(
  listing: &OpenSpaceAdminNFTStorefront.Listing{OpenSpaceAdminNFTStorefront.ListingPublic}
): OpenSpaceAdminNFTStorefront.PaymentOption {
  for paymentOption in listing.getDetails().paymentOptions {
    if paymentOption.salePaymentVaultType == Type<@FlowToken.Vault>() {
      return paymentOption
    }
  }
  panic("No valid payment options exist for this listing.")
}

transaction(adminAddress: Address, setID: String) {

  let paymentVault: @FungibleToken.Vault
  let voucherCollection: &OpenSpaceVoucher.Collection
  let nftCollection: Capability<&OpenSpaceItems.Collection{NonFungibleToken.CollectionPublic}>
  let storefront: &OpenSpaceAdminNFTStorefront.Storefront{OpenSpaceAdminNFTStorefront.StorefrontPublic}
  let listing: &OpenSpaceAdminNFTStorefront.Listing{OpenSpaceAdminNFTStorefront.ListingPublic}
  let paymentOption: OpenSpaceAdminNFTStorefront.PaymentOption

  prepare(acct: AuthAccount) {
    self.storefront = getAccount(adminAddress)
      .getCapability<&OpenSpaceAdminNFTStorefront.Storefront{OpenSpaceAdminNFTStorefront.StorefrontPublic}>(
        OpenSpaceAdminNFTStorefront.StorefrontPublicPath
      )!
      .borrow()
      ?? panic("Could not borrow Storefront from provided address")

    self.listing = findAvailableListing(storefront: self.storefront, setID: setID)
    self.paymentOption = findValidPaymentOption(listing: self.listing)

    let mainFlowVault = acct.borrow<&FlowToken.Vault>(from: /storage/flowTokenVault)
      ?? panic("Cannot borrow FlowToken vault from acct storage")
    self.paymentVault <- mainFlowVault.withdraw(amount: self.paymentOption.salePrice)

    self.nftCollection = acct.getCapability<&OpenSpaceItems.Collection{NonFungibleToken.CollectionPublic}>(OpenSpaceItems.CollectionPublicPath)
    assert(self.nftCollection.borrow() != nil, message: "Missing or mis-typed NFT Collection")

    self.voucherCollection = acct.borrow<&OpenSpaceVoucher.Collection>(
      from: OpenSpaceVoucher.CollectionStoragePath
    ) ?? panic("Cannot borrow voucher collection receiver from account")

    if self.voucherCollection.getIDs().length <= 0 {
      panic("Account has no more vouchers")
    }
  }

  execute {
    let details = self.listing.getDetails()
    let voucherID = self.voucherCollection.getIDs()[0]
    let voucher <- self.voucherCollection.withdraw(withdrawID: voucherID)
    self.listing.purchase(
        payment: <-self.paymentVault,
        voucher: <-voucher,
        nftCollectionCapability: self.nftCollection
    )
    self.storefront.cleanup(setID: setID, packID: details.packID)
  }
  
}
`

export const buyAdminListingWithFlow = async (
  admin: FlowAccount,
  purchaser: FlowAccount,
  setId: string
) => {
  return await purchaser.sendTx({
    transaction: BUY_ADMIN_LISTING_WITH_FLOW(admin.getAddress()),
    args: [admin.getAddress(true), wrapString(setId)],
  })
}
