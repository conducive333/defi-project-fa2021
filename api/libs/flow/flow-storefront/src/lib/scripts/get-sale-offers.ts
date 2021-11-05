export default (address: string, nftAddress: string) =>
  `
import OpenSpaceNFTStorefront from ${address}
import NonFungibleToken from ${nftAddress}
import OpenSpaceItems from ${address}

pub fun main(address: Address, limit: UInt64, offset: UInt64): [String] {

  let account = getAccount(address)

  let collection = account.getCapability<&OpenSpaceItems.Collection{NonFungibleToken.CollectionPublic, OpenSpaceItems.OpenSpaceItemsCollectionPublic}>(OpenSpaceItems.CollectionPublicPath).borrow()
    ?? panic("Could not borrow capability from collection")

  let collectionRef = account.getCapability(OpenSpaceItems.CollectionPublicPath)!.borrow<&{NonFungibleToken.CollectionPublic}>()
    ?? panic("Could not borrow capability from public collection")

  let storefrontRef = account
      .getCapability<&OpenSpaceItemsNFTStorefront.Storefront{OpenSpaceItemsNFTStorefront.StorefrontPublic}>(
          OpenSpaceItemsNFTStorefront.StorefrontPublicPath
      )
      .borrow()
      ?? panic("Could not borrow public storefront from address")

  let ids = storefrontRef.getListingIDs()
  let uuids: [String] = []

  var index: UInt64 = 0
  while (Int(index + offset) < ids.length && index < limit) {
    let listing = storefrontRef.borrowListing(nftID: ids[index + offset])
    if listing != nil {
      let nft = collection.borrowItem(id: listing!.getDetails().nftID)
      if nft != nil {
        let metadata = nft!.getMetadata()
        if metadata.containsKey("openSpaceItemId") {
          uuids.append(metadata["openSpaceItemId"]!)
        }
      }
    }
    index = index + 1
  }

  return uuids

}
`
