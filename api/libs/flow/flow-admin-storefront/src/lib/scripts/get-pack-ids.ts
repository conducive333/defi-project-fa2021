export default (flowStorefrontAddress: string) =>
  `
  import AdminNFTStorefrontV3 from ${flowStorefrontAddress}
  
  pub fun main(account: Address, setID: String): [String] {
      let storefrontRef = getAccount(account)
          .getCapability<&AdminNFTStorefrontV3.Storefront{AdminNFTStorefrontV3.StorefrontPublic}>(
              AdminNFTStorefrontV3.StorefrontPublicPath
          )
          .borrow()
          ?? panic("Could not borrow public storefront from address")
  
      return storefrontRef.getPackIDs(setID: setID)
  }
`
