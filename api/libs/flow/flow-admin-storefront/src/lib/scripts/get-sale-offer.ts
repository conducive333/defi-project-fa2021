export default (flowStorefrontAddress: string) =>
  `
  import AdminNFTStorefront from ${flowStorefrontAddress}
  
  // This script returns the details for a sale offer within a storefront

  pub fun main(account: Address, listingResourceID: UInt64): &AdminNFTStorefront.Listing{AdminNFTStorefront.ListingPublic} {
      let storefrontRef = getAccount(account)
          .getCapability<&AdminNFTStorefront.Storefront{AdminNFTStorefront.StorefrontPublic}>(
              AdminNFTStorefront.StorefrontPublicPath
          )
          .borrow()
          ?? panic("Could not borrow public storefront from address")
  
      return storefrontRef.borrowListing(listingResourceID: listingResourceID)
          ?? panic("No item with that ID")
  }
`
