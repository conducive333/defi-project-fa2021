import {
  CONSTANTS,
  FlowAccount,
  sendScript,
} from '@flow-testing/flow-testing-utils'

const HAS_OPEN_SPACE_ITEMS_COLLECTION = (adminAddress: string) => `
import NonFungibleToken from ${CONSTANTS.NON_FUNGIBLE_TOKEN_ADDRESS}
import OpenSpaceItems from ${adminAddress}

pub fun main(address: Address): Bool {
  let account = getAccount(address)
  if let collection = account.getCapability<&OpenSpaceItems.Collection{NonFungibleToken.CollectionPublic, OpenSpaceItems.OpenSpaceItemsCollectionPublic}>(OpenSpaceItems.CollectionPublicPath)!.borrow() {
    if let collectionRef = account.getCapability(OpenSpaceItems.CollectionPublicPath)!.borrow<&{NonFungibleToken.CollectionPublic}>() {
      return true
    }
  }
  return false
}
`

export const hasOpenSpaceCollection = async (
  admin: FlowAccount,
  user: FlowAccount
): Promise<boolean> => {
  return await sendScript({
    script: HAS_OPEN_SPACE_ITEMS_COLLECTION(admin.getAddress()),
    args: [user.getAddress(true)],
  })
}
