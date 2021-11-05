export default (address: string, nftAddress: string) =>
  `
import OpenSpaceNFTStorefront from ${address}
import NonFungibleToken from ${nftAddress}
import OpenSpaceItems from ${address}

pub fun main(address: Address, openSpaceItemId: String): &OpenSpaceNFTStorefront.Listing{OpenSpaceNFTStorefront.ListingPublic}? {

    let account = getAccount(address)
  
    let collection = account.getCapability<&OpenSpaceItems.Collection{NonFungibleToken.CollectionPublic, OpenSpaceItems.OpenSpaceItemsCollectionPublic}>(OpenSpaceItems.CollectionPublicPath).borrow()
      ?? panic("Could not borrow capability from collection")
  
    let collectionRef = account.getCapability(OpenSpaceItems.CollectionPublicPath)!.borrow<&{NonFungibleToken.CollectionPublic}>()
      ?? panic("Could not borrow capability from public collection")
  
    let storefrontRef = account
        .getCapability<&OpenSpaceNFTStorefront.Storefront{OpenSpaceNFTStorefront.StorefrontPublic}>(
            OpenSpaceNFTStorefront.StorefrontPublicPath
        )
        .borrow()
        ?? panic("Could not borrow public storefront from address")
  
    for id in storefrontRef.getListingIDs() {
      let item = collection.borrowItem(id: id)
      if item != nil {
        let metadata = item!.getMetadata()
        if metadata.containsKey("openSpaceItemsId") && metadata["openSpaceItemsId"] == openSpaceItemId {
          return storefrontRef.borrowListing(nftID: id)
        }
      }
    }
  
    return nil
     
}
`
