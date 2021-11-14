import {
  CONSTANTS,
  FlowAccount,
  wrapObjects,
} from '@flow-testing/flow-testing-utils'

const MINT_OPEN_SPACE_VOUCHER = (adminAddress: string) => `
import NonFungibleToken from ${CONSTANTS.NON_FUNGIBLE_TOKEN_ADDRESS}
import OpenSpaceVoucher from ${adminAddress}

// This transction uses the NFTMinter resource to mint a new NFT.
//
// It must be run with the account that has the minter resource
// stored at path /storage/NFTMinter.

transaction(recipient: Address, initMeta: [{String: String}]) {
    
    // local variable for storing the minter reference
    let minter: &OpenSpaceVoucher.NFTMinter

    prepare(signer: AuthAccount) {
      // borrow a reference to the NFTMinter resource in storage
      self.minter = signer.borrow<&OpenSpaceVoucher.NFTMinter>(from: OpenSpaceVoucher.MinterStoragePath)
          ?? panic("Could not borrow a reference to the NFT minter")
    }

    execute {
      // get the public account object for the recipient
      let recipient = getAccount(recipient)

      // borrow the recipient's public NFT collection reference
      let receiver = recipient
        .getCapability(OpenSpaceVoucher.CollectionPublicPath)!
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

export const mintOpenSpaceVouchers = async (
  admin: FlowAccount,
  user: FlowAccount,
  metadata: Record<string, string>[]
) => {
  return await admin.sendTx({
    transaction: MINT_OPEN_SPACE_VOUCHER(admin.getAddress()),
    args: [user.getAddress(true), wrapObjects(metadata)],
  })
}
