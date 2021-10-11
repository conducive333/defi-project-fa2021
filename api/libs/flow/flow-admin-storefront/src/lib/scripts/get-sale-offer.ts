export default (flowStorefrontAddress: string) =>
  `
  import CryptoCreateNFTStorefront from ${flowStorefrontAddress}
  
  // This script returns the details for a sale offer within a storefront

  pub fun main(account: Address, listingResourceID: UInt64): &CryptoCreateNFTStorefront.Listing{CryptoCreateNFTStorefront.ListingPublic} {
      let storefrontRef = getAccount(account)
          .getCapability<&CryptoCreateNFTStorefront.Storefront{CryptoCreateNFTStorefront.StorefrontPublic}>(
              CryptoCreateNFTStorefront.StorefrontPublicPath
          )
          .borrow()
          ?? panic("Could not borrow public storefront from address")
  
      return storefrontRef.borrowListing(listingResourceID: listingResourceID)
          ?? panic("No item with that ID")
  }
`
