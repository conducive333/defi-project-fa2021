import { FlowAccount, wrapString } from '@flow-testing/flow-testing-utils'

const CODE = (adminAddress: string) => `
import OpenSpaceAdminNFTStorefront from ${adminAddress}

transaction(setID: String, packID: String) {
  let storefront: &OpenSpaceAdminNFTStorefront.Storefront{OpenSpaceAdminNFTStorefront.StorefrontManager}

  prepare(acct: AuthAccount) {
    self.storefront = acct.borrow<&OpenSpaceAdminNFTStorefront.Storefront{OpenSpaceAdminNFTStorefront.StorefrontManager}>(from: OpenSpaceAdminNFTStorefront.StorefrontStoragePath)
      ?? panic("Missing or mis-typed OpenSpaceAdminNFTStorefront.Storefront")
  }

  execute {
    self.storefront.removeListing(setID: setID, packID: packID)
  }
}
`

export const removeAdminListing = async (
  admin: FlowAccount,
  setId: string,
  packId: string
) => {
  return await admin.sendTx({
    transaction: CODE(admin.getAddress()),
    args: [wrapString(setId), wrapString(packId)],
  })
}
