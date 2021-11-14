import {
  CONSTANTS,
  FlowAccount,
  sendScript,
} from '@flow-testing/flow-testing-utils'

const OPEN_SPACE_VOUCHER_COLLECTION_LEN = (adminAddress: string) => `
import NonFungibleToken from ${CONSTANTS.NON_FUNGIBLE_TOKEN_ADDRESS}
import OpenSpaceVoucher from ${adminAddress}

pub fun main(address: Address): Int {

  let account = getAccount(address)

  let collection = account.getCapability<&OpenSpaceVoucher.Collection{NonFungibleToken.CollectionPublic, OpenSpaceVoucher.OpenSpaceVoucherCollectionPublic}>(OpenSpaceVoucher.CollectionPublicPath).borrow()
    ?? panic("Could not borrow capability from collection")

  let collectionRef = account.getCapability(OpenSpaceVoucher.CollectionPublicPath)!.borrow<&{NonFungibleToken.CollectionPublic}>()
    ?? panic("Could not borrow capability from public collection")

  return collectionRef.getIDs().length

}
`

export const getOpenSpaceVoucherCollectionLen = async (
  admin: FlowAccount,
  user: FlowAccount
): Promise<number> => {
  return await sendScript({
    script: OPEN_SPACE_VOUCHER_COLLECTION_LEN(admin.getAddress()),
    args: [user.getAddress(true)],
  })
}
