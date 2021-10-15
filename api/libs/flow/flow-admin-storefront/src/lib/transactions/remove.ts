export default (flowStorefrontAddress: string) =>
  `
import AdminNFTStorefront from ${flowStorefrontAddress}

transaction(listingResourceID: UInt64) {
    let storefront: &AdminNFTStorefront.AdminStorefront{AdminNFTStorefront.StorefrontManager}

    prepare(acct: AuthAccount) {
        self.storefront = acct.borrow<&AdminNFTStorefront.AdminStorefront{AdminNFTStorefront.StorefrontManager}>(from: AdminNFTStorefront.AdminStorefrontStoragePath)
            ?? panic("Missing or mis-typed AdminNFTStorefront.AdminStorefront")
    }

    execute {
        self.storefront.removeListing(listingResourceID: listingResourceID)
    }
}
`
