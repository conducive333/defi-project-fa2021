export default (address: string) =>
  `
import DBNFTStorefront from ${address}

transaction(saleOfferResourceID: UInt64) {
    let storefront: &DBNFTStorefront.Storefront{DBNFTStorefront.StorefrontManager}

    prepare(acct: AuthAccount) {
        self.storefront = acct.borrow<&DBNFTStorefront.Storefront{DBNFTStorefront.StorefrontManager}>(from: DBNFTStorefront.StorefrontStoragePath)
            ?? panic("Missing or mis-typed DBNFTStorefront.Storefront")
    }

    execute {
        self.storefront.removeSaleOffer(saleOfferResourceID: saleOfferResourceID)
    }
}
`
