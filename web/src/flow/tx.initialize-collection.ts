import * as fcl from "@onflow/fcl"
import {tx} from "./utils/tx"

const CODE = fcl.cdc`
  import NonFungibleToken from 0xnftAddress
  import OpenSpaceItems from 0xaddress
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
`

export function initializeCollection(opts = {}) {
  // prettier-ignore
  return tx([
    fcl.transaction(CODE),
    fcl.proposer(fcl.authz),
    fcl.payer(fcl.authz),
    fcl.authorizations([
      fcl.authz
    ]),
    fcl.limit(1000)
  ], opts)
}