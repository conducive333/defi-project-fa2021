export default (flowStorefrontAddress: string) =>
  `
import CryptoCreateNFTStorefront from ${flowStorefrontAddress}

transaction(listingResourceID: UInt64) {
    let storefront: &CryptoCreateNFTStorefront.Storefront{CryptoCreateNFTStorefront.StorefrontManager}

    prepare(acct: AuthAccount) {
        self.storefront = acct.borrow<&CryptoCreateNFTStorefront.Storefront{CryptoCreateNFTStorefront.StorefrontManager}>(from: CryptoCreateNFTStorefront.StorefrontStoragePath)
            ?? panic("Missing or mis-typed CryptoCreateNFTStorefront.Storefront")
    }

    execute {
        self.storefront.removeListing(listingResourceID: listingResourceID)
    }
}
`
