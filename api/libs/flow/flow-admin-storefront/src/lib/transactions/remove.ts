export default (flowStorefrontAddress: string) =>
  `
import AdminNFTStorefrontV3 from ${flowStorefrontAddress}

transaction(setID: String, packID: String) {
    let storefront: &AdminNFTStorefrontV3.AdminStorefront{AdminNFTStorefrontV3.StorefrontManager}

    prepare(acct: AuthAccount) {
        self.storefront = acct.borrow<&AdminNFTStorefrontV3.AdminStorefront{AdminNFTStorefrontV3.StorefrontManager}>(from: AdminNFTStorefrontV3.AdminStorefrontStoragePath)
            ?? panic("Missing or mis-typed AdminNFTStorefrontV3.AdminStorefront")
    }

    execute {
        self.storefront.removeListing(setID: setID, packID: packID)
    }
}
`
