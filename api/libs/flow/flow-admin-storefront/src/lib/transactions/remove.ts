export default (devAddress: string) => `
import OpenSpaceAdminNFTStorefront from ${devAddress}

transaction(setID: String, packID: String) {
  let storefront: &OpenSpaceAdminNFTStorefront.Storefront{OpenSpaceAdminNFTStorefront.StorefrontManager}

  prepare(acct: AuthAccount) {
    self.storefront = acct.borrow<&OpenSpaceAdminNFTStorefront.Storefront{OpenSpaceAdminNFTStorefront.StorefrontManager}>(from: OpenSpaceAdminNFTStorefront.StorefrontStoragePath)
      ?? panic("Missing or mis-typed OpenSpaceAdminNFTStorefront.Storefront")
  }

  execute {
    self.storefront.removeListing(setID: setID, packID: packID)
  }
}
`
