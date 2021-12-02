import OpenSpaceAdminNFTStorefront from "../contracts/custom/OpenSpaceAdminNFTStorefront.cdc"

// pub fun main(account: Address): [String] {
//   let storefrontRef = getAccount(account)
//     .getCapability<&OpenSpaceAdminNFTStorefront.Storefront{OpenSpaceAdminNFTStorefront.StorefrontPublic}>(
//         OpenSpaceAdminNFTStorefront.StorefrontPublicPath
//     )
//     .borrow()
//     ?? panic("Could not borrow public storefront from address")

//   return storefrontRef.getSetIDs()
// }

  pub fun main(account: Address, setID: String, packID: String): &OpenSpaceAdminNFTStorefront.Listing{OpenSpaceAdminNFTStorefront.ListingPublic}? {
      let storefrontRef = getAccount(account)
          .getCapability<&OpenSpaceAdminNFTStorefront.Storefront{OpenSpaceAdminNFTStorefront.StorefrontPublic}>(
              OpenSpaceAdminNFTStorefront.StorefrontPublicPath
          )
          .borrow()
          ?? panic("Could not borrow public storefront from address")
  
      return storefrontRef.borrowListing(setID: setID, packID: packID)
  }

// pub fun main(account: Address, setID: String): [String] {
//   let storefrontRef = getAccount(account)
//     .getCapability<&OpenSpaceAdminNFTStorefront.Storefront{OpenSpaceAdminNFTStorefront.StorefrontPublic}>(
//         OpenSpaceAdminNFTStorefront.StorefrontPublicPath
//     )
//     .borrow()
//     ?? panic("Could not borrow public storefront from address")

//   return storefrontRef.getPackIDs(setID: setID)
// }

// pub fun main(account: Address, setID: String): Int {
//   let storefrontRef = getAccount(account)
//     .getCapability<&OpenSpaceAdminNFTStorefront.Storefront{OpenSpaceAdminNFTStorefront.StorefrontPublic}>(
//       OpenSpaceAdminNFTStorefront.StorefrontPublicPath
//     )
//     .borrow()
//     ?? panic("Could not borrow public storefront from address")

//   let listings = storefrontRef.borrowListings(setID: setID)
//   if listings != nil {
//     return listings!.length
//   }
//   return 0
// }