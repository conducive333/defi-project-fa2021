import {
  CONSTANTS,
  FlowAccount,
  sendScript,
} from '@flow-testing/flow-testing-utils'

const HAS_OPEN_SPACE_VOUCHER_COLLECTION = (adminAddress: string) => `
import NonFungibleToken from ${CONSTANTS.NON_FUNGIBLE_TOKEN_ADDRESS}
import OpenSpaceVoucher from ${adminAddress}

pub fun main(address: Address): Bool {
  let account = getAccount(address)
  if let collection = account.getCapability<&OpenSpaceVoucher.Collection{NonFungibleToken.CollectionPublic, OpenSpaceVoucher.OpenSpaceVoucherCollectionPublic}>(OpenSpaceVoucher.CollectionPublicPath)!.borrow() {
    if let collectionRef = account.getCapability(OpenSpaceVoucher.CollectionPublicPath)!.borrow<&{NonFungibleToken.CollectionPublic}>() {
      return true
    }
  }
  return false
}
`

export const hasOpenSpaceVoucherCollection = async (
  admin: FlowAccount,
  user: FlowAccount
): Promise<boolean> => {
  return await sendScript({
    script: HAS_OPEN_SPACE_VOUCHER_COLLECTION(admin.getAddress()),
    args: [user.getAddress(true)],
  })
}
