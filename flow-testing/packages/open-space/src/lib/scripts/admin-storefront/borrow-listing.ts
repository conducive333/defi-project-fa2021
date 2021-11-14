import {
  FlowAccount,
  sendScript,
  wrapString,
} from '@flow-testing/flow-testing-utils'

const BORROW_LISTING = (adminAddress: string) => `
import OpenSpaceAdminNFTStorefront from ${adminAddress}
  
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

export const borrowListing = async (
  admin: FlowAccount,
  setId: string,
  packId: string
): Promise<{
  uuid: number
  details: unknown
}> => {
  return await sendScript({
    script: BORROW_LISTING(admin.getAddress()),
    args: [admin.getAddress(true), wrapString(setId), wrapString(packId)],
  })
}
