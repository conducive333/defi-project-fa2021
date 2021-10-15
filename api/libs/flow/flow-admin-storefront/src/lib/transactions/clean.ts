export default (flowStorefrontAddress: string) =>
  `
import AdminNFTStorefront from ${flowStorefrontAddress}

transaction(listingResourceID: UInt64, storefrontAddress: Address) {
    let storefront: &AdminNFTStorefront.Storefront{AdminNFTStorefront.StorefrontPublic}

    prepare(acct: AuthAccount) {
        self.storefront = getAccount(storefrontAddress)
            .getCapability<&AdminNFTStorefront.Storefront{AdminNFTStorefront.StorefrontPublic}>(
                AdminNFTStorefront.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")
    }

    execute {
        // Be kind and recycle
        self.storefront.cleanup(listingResourceID: listingResourceID)
    }
}
`
