export default (address: string, nftAddress: string) =>
  `
import NonFungibleToken from ${nftAddress}
import CryptoCreateItems from ${address}

pub fun main(address: Address, limit: Int, offset: Int): [&CryptoCreateItems.NFT?] {

  let account = getAccount(address)

  let collection = account.getCapability<&CryptoCreateItems.Collection{NonFungibleToken.CollectionPublic, CryptoCreateItems.CryptoCreateItemsCollectionPublic}>(CryptoCreateItems.CollectionPublicPath).borrow()
    ?? panic("Could not borrow capability from collection")

  let collectionRef = account.getCapability(CryptoCreateItems.CollectionPublicPath)!.borrow<&{NonFungibleToken.CollectionPublic}>()
    ?? panic("Could not borrow capability from public collection")

  let ids = collectionRef.getIDs()
  let items: [&CryptoCreateItems.NFT?] = []

  var index = 0
  while ((index + offset) < ids.length && index < limit) {
    items.append(collection.borrowDooverseItem(id: ids[index + offset]))
    index = index + 1
  }

  return items

}
`
