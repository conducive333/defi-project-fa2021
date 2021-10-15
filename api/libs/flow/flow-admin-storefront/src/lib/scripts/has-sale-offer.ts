export default (flowStorefrontAddress: string) =>
  `
  import AdminNFTStorefront from ${flowStorefrontAddress}
  
  pub fun main(account: Address, listingResourceID: UInt64): Bool {
    if let storefrontRef = getAccount(account).getCapability<&AdminNFTStorefront.Storefront{AdminNFTStorefront.StorefrontPublic}>(AdminNFTStorefront.StorefrontPublicPath).borrow() {
      if let hasListing = storefrontRef.borrowListing(listingResourceID: listingResourceID) {
        return true
      }
      return false
    }
    return false
  }
`
