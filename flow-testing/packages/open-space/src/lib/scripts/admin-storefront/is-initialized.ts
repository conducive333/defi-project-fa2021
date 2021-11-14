import { FlowAccount, sendScript } from '@flow-testing/flow-testing-utils'

const HAS_OPEN_SPACE_ADMIN_NFT_STOREFRONT = (adminAddress: string) => `
import OpenSpaceAdminNFTStorefront from ${adminAddress}

pub fun main(address: Address): Bool {
  let account = getAccount(address)
  if let storefrontRef = account.getCapability<&OpenSpaceAdminNFTStorefront.Storefront{OpenSpaceAdminNFTStorefront.StorefrontPublic}>(OpenSpaceAdminNFTStorefront.StorefrontPublicPath).borrow() {
    return true
  }
  return false
}
`

export const hasOpenSpaceAdminNFTStorefront = async (
  admin: FlowAccount,
  user: FlowAccount
): Promise<boolean> => {
  return await sendScript({
    script: HAS_OPEN_SPACE_ADMIN_NFT_STOREFRONT(admin.getAddress()),
    args: [user.getAddress(true)],
  })
}
