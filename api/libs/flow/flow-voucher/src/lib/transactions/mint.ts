export default (adminAddress: string, nftAddress: string) => `
import NonFungibleToken from ${nftAddress}
import OpenSpaceVoucher from ${adminAddress}

// This transction uses the NFTMinter resource to mint a new NFT.
//
// It must be run with the account that has the minter resource
// stored at path /storage/NFTMinter.

transaction(recipient: Address, count: UInt64) {
    
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
      var i: UInt64 = 0
      while (i < count) {
        self.minter.mintNFT(recipient: receiver, initMetadata: {})
        i = i + 1
      }
    }
}
`
