import {
  FlowAccount,
  sendScript,
  wrapString,
} from '@flow-testing/flow-testing-utils'

const COUNT_SET_LISTINGS = (adminAddress: string) => `
import OpenSpaceAdminNFTStorefront from ${adminAddress}

pub fun main(account: Address, setID: String): Int {
  let storefrontRef = getAccount(account)
    .getCapability<&OpenSpaceAdminNFTStorefront.Storefront{OpenSpaceAdminNFTStorefront.StorefrontPublic}>(
      OpenSpaceAdminNFTStorefront.StorefrontPublicPath
    )
    .borrow()
    ?? panic("Could not borrow public storefront from address")

  let listings = storefrontRef.borrowListings(setID: setID)
  if listings != nil {
    return listings!.length
  }
  return 0
}
`

export const countSetListings = async (
  admin: FlowAccount,
  setId: string
): Promise<number> => {
  return await sendScript({
    script: COUNT_SET_LISTINGS(admin.getAddress()),
    args: [admin.getAddress(true), wrapString(setId)],
  })
}
