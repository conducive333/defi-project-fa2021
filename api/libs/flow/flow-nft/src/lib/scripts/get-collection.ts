export default (address: string, nftAddress: string) =>
  `
import NonFungibleToken from ${nftAddress}
import OpenSpaceItems from ${address}

pub fun main(address: Address, limit: UInt64, offset: UInt64): [&OpenSpaceItems.NFT?] {

  let account = getAccount(address)

  let collection = account.getCapability<&OpenSpaceItems.Collection{NonFungibleToken.CollectionPublic, OpenSpaceItems.OpenSpaceItemsCollectionPublic}>(OpenSpaceItems.CollectionPublicPath).borrow()
    ?? panic("Could not borrow capability from collection")

  let collectionRef = account.getCapability(OpenSpaceItems.CollectionPublicPath)!.borrow<&{NonFungibleToken.CollectionPublic}>()
    ?? panic("Could not borrow capability from public collection")

  let ids = collectionRef.getIDs()
  let items: [&OpenSpaceItems.NFT?] = []

  var index: UInt64 = 0
  while (Int(index + offset) < ids.length && index < limit) {
    items.append(collection.borrowItem(id: ids[index + offset]))
    index = index + 1
  }

  return items

}
`
