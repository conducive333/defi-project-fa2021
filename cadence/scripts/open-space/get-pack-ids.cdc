import OpenSpaceAdminNFTStorefront from "../../contracts/custom/OpenSpaceAdminNFTStorefront.cdc"

pub fun main(account: Address, setID: String): [String] {
  let storefrontRef = getAccount(account)
    .getCapability<&OpenSpaceAdminNFTStorefront.Storefront{OpenSpaceAdminNFTStorefront.StorefrontPublic}>(
        OpenSpaceAdminNFTStorefront.StorefrontPublicPath
    )
    .borrow()
    ?? panic("Could not borrow public storefront from address")

  return storefrontRef.getPackIDs(setID: setID)
}

