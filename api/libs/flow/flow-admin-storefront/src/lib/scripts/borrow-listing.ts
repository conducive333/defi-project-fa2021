export default (devAddress: string) =>
`
import OpenSpaceAdminNFTStorefront from ${devAddress}
  
pub fun main(account: Address, setID: String, packID: String): &OpenSpaceAdminNFTStorefront.Listing{OpenSpaceAdminNFTStorefront.ListingPublic}? {
    let storefrontRef = getAccount(account)
        .getCapability<&OpenSpaceAdminNFTStorefront.Storefront{OpenSpaceAdminNFTStorefront.StorefrontPublic}>(
            OpenSpaceAdminNFTStorefront.StorefrontPublicPath
        )
        .borrow()
        ?? panic("Could not borrow public storefront from address")

    return storefrontRef.borrowListing(setID: setID, packID: packID)
}
`
