import {
  CONSTANTS,
  FlowAccount,
  wrapObjects,
} from '@flow-testing/flow-testing-utils'

const CODE = (adminAddress: string) => `
import NonFungibleToken from ${CONSTANTS.NON_FUNGIBLE_TOKEN_ADDRESS}
import OpenSpaceItems from ${adminAddress}

// This transction uses the NFTMinter resource to mint a new NFT.
//
// It must be run with the account that has the minter resource
// stored at path /storage/NFTMinter.

transaction(recipient: Address, initMeta: [{String: String}]) {

  // local variable for storing the minter reference
  let minter: &OpenSpaceItems.NFTMinter
    
  prepare(signer: AuthAccount) {
    // borrow a reference to the NFTMinter resource in storage
    self.minter = signer.borrow<&OpenSpaceItems.NFTMinter>(from: OpenSpaceItems.MinterStoragePath)
      ?? panic("Could not borrow a reference to the NFT minter")
  }

  execute {
    // get the public account object for the recipient
    let recipient = getAccount(recipient)

    // borrow the recipient's public NFT collection reference
    let receiver = recipient
      .getCapability(OpenSpaceItems.CollectionPublicPath)!
      .borrow<&{NonFungibleToken.CollectionPublic}>()
      ?? panic("Could not get receiver reference to the NFT Collection")

    // mint the NFT and deposit it to the recipient's collection
    var i = 0
    while (i < initMeta.length) {
      self.minter.mintNFT(recipient: receiver, initMetadata: initMeta[i])
      i = i + 1
    }
  }

}
`

export const mintOpenSpaceItem = async (
  admin: FlowAccount,
  user: FlowAccount,
  metadata: Record<string, string>[]
) => {
  return await admin.sendTx({
    transaction: CODE(admin.getAddress()),
    args: [user.getAddress(true), wrapObjects(metadata)],
  })
}
