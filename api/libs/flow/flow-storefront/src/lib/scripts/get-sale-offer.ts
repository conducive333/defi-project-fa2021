export default (flowStorefrontAddress: string) =>
  `
  import NFTStorefront from ${flowStorefrontAddress}
  
  // This script returns the details for a sale offer within a storefront

  pub fun main(account: Address, listingResourceID: UInt64): &NFTStorefront.Listing{NFTStorefront.ListingPublic} {
      let storefrontRef = getAccount(account)
          .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(
              NFTStorefront.StorefrontPublicPath
          )
          .borrow()
          ?? panic("Could not borrow public storefront from address")
  
      return storefrontRef.borrowListing(listingResourceID: listingResourceID)
          ?? panic("No item with that ID")
  }
`
