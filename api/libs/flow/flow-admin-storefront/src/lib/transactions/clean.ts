export default (flowStorefrontAddress: string) =>
  `
import CryptoCreateNFTStorefront from ${flowStorefrontAddress}

transaction(listingResourceID: UInt64, storefrontAddress: Address) {
    let storefront: &CryptoCreateNFTStorefront.Storefront{CryptoCreateNFTStorefront.StorefrontPublic}

    prepare(acct: AuthAccount) {
        self.storefront = getAccount(storefrontAddress)
            .getCapability<&CryptoCreateNFTStorefront.Storefront{CryptoCreateNFTStorefront.StorefrontPublic}>(
                CryptoCreateNFTStorefront.StorefrontPublicPath
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
