export default (flowStorefrontAddress: string) =>
  `
import AdminNFTStorefrontV3 from ${flowStorefrontAddress}

transaction {
    prepare(acct: AuthAccount) {

        // If the account doesn't already have a Storefront
        if acct.borrow<&AdminNFTStorefrontV3.Storefront>(from: AdminNFTStorefrontV3.StorefrontStoragePath) == nil {

            // Create a new empty .Storefront
            let storefront <- AdminNFTStorefrontV3.createStorefront() as! @AdminNFTStorefrontV3.Storefront
            
            // save it to the account
            acct.save(<-storefront, to: AdminNFTStorefrontV3.StorefrontStoragePath)

            // create a public capability for the .Storefront
            acct.link<&AdminNFTStorefrontV3.Storefront{AdminNFTStorefrontV3.StorefrontPublic}>(AdminNFTStorefrontV3.StorefrontPublicPath, target: AdminNFTStorefrontV3.StorefrontStoragePath)
        }
    }
}
`
