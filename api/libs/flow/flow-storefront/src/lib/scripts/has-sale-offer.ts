export default (flowStorefrontAddress: string) =>
  `
  import NFTStorefront from ${flowStorefrontAddress}
  
  pub fun main(account: Address, listingResourceID: UInt64): Bool {
    if let storefrontRef = getAccount(account).getCapability<&NFTStorefront.Storefront{NFTStorefront.StorefrontPublic}>(NFTStorefront.StorefrontPublicPath).borrow() {
      if let hasListing = storefrontRef.borrowListing(listingResourceID: listingResourceID) {
        return true
      }
      return false
    }
    return false
  }
`
