import NonFungibleToken from "../../contracts/standard/NonFungibleToken.cdc"
import OpenSpaceItems from "../../contracts/custom/OpenSpaceItems.cdc"

transaction {
    prepare(signer: AuthAccount) {
        // if the account doesn't already have a collection
        if signer.borrow<&OpenSpaceItems.Collection>(from: OpenSpaceItems.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- OpenSpaceItems.createEmptyCollection()
            
            // save it to the account
            signer.save(<-collection, to: OpenSpaceItems.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&OpenSpaceItems.Collection{NonFungibleToken.CollectionPublic, OpenSpaceItems.OpenSpaceItemsCollectionPublic}>(OpenSpaceItems.CollectionPublicPath, target: OpenSpaceItems.CollectionStoragePath)
        }
    }
}