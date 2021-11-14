import {
  CONSTANTS,
  FlowAccount,
  sendScript,
} from '@flow-testing/flow-testing-utils'

const OPEN_SPACE_ITEMS_COLLECTION_LEN = (adminAddress: string) => `
import NonFungibleToken from ${CONSTANTS.NON_FUNGIBLE_TOKEN_ADDRESS}
import OpenSpaceItems from ${adminAddress}

pub fun main(address: Address): Int {

  let account = getAccount(address)

  let collection = account.getCapability<&OpenSpaceItems.Collection{NonFungibleToken.CollectionPublic, OpenSpaceItems.OpenSpaceItemsCollectionPublic}>(OpenSpaceItems.CollectionPublicPath).borrow()
    ?? panic("Could not borrow capability from collection")

  let collectionRef = account.getCapability(OpenSpaceItems.CollectionPublicPath)!.borrow<&{NonFungibleToken.CollectionPublic}>()
    ?? panic("Could not borrow capability from public collection")

  return collectionRef.getIDs().length

}
`

export const getOpenSpaceCollectionLen = async (
  admin: FlowAccount,
  user: FlowAccount
): Promise<number> => {
  return await sendScript({
    script: OPEN_SPACE_ITEMS_COLLECTION_LEN(admin.getAddress()),
    args: [user.getAddress(true)],
  })
}
