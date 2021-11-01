export default (flowStorefrontAddress: string) =>
  `
import AdminNFTStorefrontV3 from ${flowStorefrontAddress}

transaction(setID: String, packID: String, storefrontAddress: Address) {
    let storefront: &AdminNFTStorefrontV3.Storefront{AdminNFTStorefrontV3.StorefrontPublic}

    prepare(acct: AuthAccount) {
        self.storefront = getAccount(storefrontAddress)
            .getCapability<&AdminNFTStorefrontV3.Storefront{AdminNFTStorefrontV3.StorefrontPublic}>(
                AdminNFTStorefrontV3.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Could not borrow Storefront from provided address")
    }

    execute {
        // Be kind and recycle
        self.storefront.cleanup(setID: setID, packID: packID)
    }
}
`
