export default (address: string) =>
  `
import DBNFTStorefront from ${address}

transaction(saleOfferResourceID: UInt64, storefrontAddress: Address) {
    let storefront: &DBNFTStorefront.Storefront{DBNFTStorefront.StorefrontPublic}

    prepare(acct: AuthAccount) {
        self.storefront = getAccount(storefrontAddress)
            .getCapability<&DBNFTStorefront.Storefront{DBNFTStorefront.StorefrontPublic}>(
                DBNFTStorefront.StorefrontPublicPath
            )!
            .borrow()
            ?? panic("Cannot borrow Storefront from provided address")
    }

    execute {
        
        // Be kind and recycle
        self.storefront.cleanup(saleOfferResourceID: saleOfferResourceID)
    }
}
`
