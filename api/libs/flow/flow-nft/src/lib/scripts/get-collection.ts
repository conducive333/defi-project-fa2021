export default (address: string, nftAddress: string) =>
  `
import NonFungibleToken from ${nftAddress}
import DooverseItems from ${address}

pub fun main(address: Address, limit: Int, offset: Int): [&DooverseItems.NFT?] {

  let account = getAccount(address)

  let collection = account.getCapability<&DooverseItems.Collection{NonFungibleToken.CollectionPublic, DooverseItems.DooverseItemsCollectionPublic}>(DooverseItems.CollectionPublicPath).borrow()
    ?? panic("Could not borrow capability from collection")

  let collectionRef = account.getCapability(DooverseItems.CollectionPublicPath)!.borrow<&{NonFungibleToken.CollectionPublic}>()
    ?? panic("Could not borrow capability from public collection")

  let ids = collectionRef.getIDs()
  let items: [&DooverseItems.NFT?] = []

  var index = 0
  while ((index + offset) < ids.length && index < limit) {
    items.append(collection.borrowDooverseItem(id: ids[index + offset]))
    index = index + 1
  }

  return items

}
`
