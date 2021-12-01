import OpenSpaceAdminNFTStorefront from "../../contracts/custom/OpenSpaceAdminNFTStorefront.cdc"

transaction {
  let storefront: &OpenSpaceAdminNFTStorefront.Storefront{OpenSpaceAdminNFTStorefront.StorefrontPublic, OpenSpaceAdminNFTStorefront.StorefrontManager}

  prepare(acct: AuthAccount) {
    self.storefront = acct.borrow<&OpenSpaceAdminNFTStorefront.Storefront{OpenSpaceAdminNFTStorefront.StorefrontPublic, OpenSpaceAdminNFTStorefront.StorefrontManager}>(from: OpenSpaceAdminNFTStorefront.StorefrontStoragePath)
      ?? panic("Missing or mis-typed OpenSpaceAdminNFTStorefront.Storefront")
  }

  execute {
    for setID in self.storefront.getSetIDs() {
      let packIDs = self.storefront.getPackIDs(setID: setID)
      for packID in packIDs {
        self.storefront.removeListing(setID: setID, packID: packID)
      }
    }
  }
}