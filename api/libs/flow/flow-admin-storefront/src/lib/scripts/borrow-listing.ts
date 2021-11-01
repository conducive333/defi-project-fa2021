export default (flowStorefrontAddress: string) =>
  `
  import AdminNFTStorefrontV3 from ${flowStorefrontAddress}
  
  pub fun main(account: Address, setID: String, packID: String): &AdminNFTStorefrontV3.Listing{AdminNFTStorefrontV3.ListingPublic}? {
      let storefrontRef = getAccount(account)
          .getCapability<&AdminNFTStorefrontV3.Storefront{AdminNFTStorefrontV3.StorefrontPublic}>(
              AdminNFTStorefrontV3.StorefrontPublicPath
          )
          .borrow()
          ?? panic("Could not borrow public storefront from address")
  
      return storefrontRef.borrowListing(setID: setID, packID: packID)
  }
`
