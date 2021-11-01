export default (flowStorefrontAddress: string) =>
  `
  import AdminNFTStorefrontV3 from ${flowStorefrontAddress}
  
  pub fun main(account: Address, setID: String, packID: String): Bool {
    if let storefrontRef = getAccount(account).getCapability<&AdminNFTStorefrontV3.Storefront{AdminNFTStorefrontV3.StorefrontPublic}>(AdminNFTStorefrontV3.StorefrontPublicPath).borrow() {
      if let hasListing = storefrontRef.borrowListing(setID: setID, packID: packID) {
        return true
      }
      return false
    }
    return false
  }
`
