export default (address: string) =>
  `
import DBNFTStorefront from ${address}

// This transaction installs the Storefront ressource in an account.

transaction {
    prepare(acct: AuthAccount) {

        // If the account doesn't already have a Storefront
        if acct.borrow<&DBNFTStorefront.Storefront>(from: DBNFTStorefront.StorefrontStoragePath) == nil {

            // Create a new empty .Storefront
            let storefront <- DBNFTStorefront.createStorefront() as! @DBNFTStorefront.Storefront
            
            // save it to the account
            acct.save(<-storefront, to: DBNFTStorefront.StorefrontStoragePath)

            // create a public capability for the .Storefront
            acct.link<&DBNFTStorefront.Storefront{DBNFTStorefront.StorefrontPublic}>(DBNFTStorefront.StorefrontPublicPath, target: DBNFTStorefront.StorefrontStoragePath)
        }
    }
}
`
