export default (address: string, nftAddress: string) =>
  `
import NonFungibleToken from ${nftAddress}
import DooverseItems from ${address}

pub fun main(address: Address): Bool {
  let account = getAccount(address)
  if let collection = account.getCapability<&DooverseItems.Collection{NonFungibleToken.CollectionPublic, DooverseItems.DooverseItemsCollectionPublic}>(DooverseItems.CollectionPublicPath)!.borrow() {
    if let collectionRef = account.getCapability(DooverseItems.CollectionPublicPath)!.borrow<&{NonFungibleToken.CollectionPublic}>() {
      return true
    }
  }
  return false
}
`
