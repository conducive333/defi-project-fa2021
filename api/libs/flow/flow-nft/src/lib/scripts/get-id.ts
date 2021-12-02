export default (address: string, nftAddress: string) =>
  `
import NonFungibleToken from ${nftAddress}
import OpenSpaceItems from ${address}

pub fun main(address: Address, uuid: String): UInt64? {

  let account = getAccount(address)

  let collection = account.getCapability<&OpenSpaceItems.Collection{NonFungibleToken.CollectionPublic, OpenSpaceItems.OpenSpaceItemsCollectionPublic}>(OpenSpaceItems.CollectionPublicPath).borrow()
    ?? panic("Could not borrow capability from collection")

  let collectionRef = account.getCapability(OpenSpaceItems.CollectionPublicPath)!.borrow<&{NonFungibleToken.CollectionPublic}>()
    ?? panic("Could not borrow capability from public collection")
  
  for id in collection.getIDs() {
    let item = collection.borrowItem(id: id)
    if item != nil {
      let metadata = item!.getMetadata()
      if metadata.containsKey("openSpaceItemsId") && metadata["openSpaceItemsId"] == uuid {
        return id
      }
    }
  }

  return nil

}
`
