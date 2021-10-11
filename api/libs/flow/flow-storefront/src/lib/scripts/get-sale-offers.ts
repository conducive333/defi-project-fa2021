export default (flowStorefrontAddress: string) =>
  `
  import NFTStorefront from ${flowStorefrontAddress}
  
  // This script returns the details for a sale offer within a storefront

  pub fun main(account: Address, limit: Int, offset: Int): [&NFTStorefront.Listing{NFTStorefront.ListingPublic}] {
      
      let storefrontRef = getAccount(account)
          .getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(
              NFTStorefront.StorefrontPublicPath
          )
          .borrow()
          ?? panic("Could not borrow public storefront from address")
        
      let ids = storefrontRef.getListingIDs()
      let listings: [&NFTStorefront.Listing{NFTStorefront.ListingPublic}] = []

      var index = 0
      while ((index + offset) < ids.length && index < limit) {
        let listing = storefrontRef.borrowListing(listingResourceID: ids[index + offset])
          ?? panic("No item with that ID")
        listings.append(listing)
        index = index + 1
      }
      
      return listings
      
  }
`
