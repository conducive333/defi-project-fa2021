export default (address: string, nftAddress: string) =>
  `
import NonFungibleToken from ${nftAddress}
import CryptoCreateItems from ${address}

pub fun main(address: Address): Bool {
  let account = getAccount(address)
  if let collection = account.getCapability<&CryptoCreateItems.Collection{NonFungibleToken.CollectionPublic, CryptoCreateItems.CryptoCreateItemsCollectionPublic}>(CryptoCreateItems.CollectionPublicPath)!.borrow() {
    if let collectionRef = account.getCapability(CryptoCreateItems.CollectionPublicPath)!.borrow<&{NonFungibleToken.CollectionPublic}>() {
      return true
    }
  }
  return false
}
`
