export default (flowStorefrontAddress: string) =>
  `
  import AdminNFTStorefront from ${flowStorefrontAddress}
  
  // This script returns the details for a sale offer within a storefront

  pub fun main(account: Address, limit: Int, offset: Int): [&AdminNFTStorefront.Listing{AdminNFTStorefront.ListingPublic}] {
      
      let storefrontRef = getAccount(account)
          .getCapability<&AdminNFTStorefront.Storefront{AdminNFTStorefront.StorefrontPublic}>(
              AdminNFTStorefront.StorefrontPublicPath
          )
          .borrow()
          ?? panic("Could not borrow public storefront from address")
        
      let ids = storefrontRef.getListingIDs()
      let listings: [&AdminNFTStorefront.Listing{AdminNFTStorefront.ListingPublic}] = []

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
