import { CONSTANTS, FlowAccount } from '@flow-testing/flow-testing-utils'

const SETUP_OPEN_SPACE_ACCOUNT = (adminAddress: string) => `
import NonFungibleToken from ${CONSTANTS.NON_FUNGIBLE_TOKEN_ADDRESS}
import FungibleToken from ${CONSTANTS.FUNGIBLE_TOKEN_ADDRESS}
import FUSD from ${CONSTANTS.FUSD_ADDRESS}
import OpenSpaceVoucher from ${adminAddress}
import OpenSpaceItems from ${adminAddress}

transaction {
    prepare(signer: AuthAccount) {
        // If the account doesn't already have a open space collection
        if signer.borrow<&OpenSpaceItems.Collection>(from: OpenSpaceItems.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- OpenSpaceItems.createEmptyCollection()
            
            // save it to the account
            signer.save(<-collection, to: OpenSpaceItems.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&OpenSpaceItems.Collection{NonFungibleToken.CollectionPublic, OpenSpaceItems.OpenSpaceItemsCollectionPublic}>(OpenSpaceItems.CollectionPublicPath, target: OpenSpaceItems.CollectionStoragePath)
        }

        // If the account doesn't already have a voucher collection
        if signer.borrow<&OpenSpaceVoucher.Collection>(from: OpenSpaceVoucher.CollectionStoragePath) == nil {

            // create a new empty collection
            let collection <- OpenSpaceVoucher.createEmptyCollection()
            
            // save it to the account
            signer.save(<-collection, to: OpenSpaceVoucher.CollectionStoragePath)

            // create a public capability for the collection
            signer.link<&OpenSpaceVoucher.Collection{NonFungibleToken.CollectionPublic, OpenSpaceVoucher.OpenSpaceVoucherCollectionPublic}>(OpenSpaceVoucher.CollectionPublicPath, target: OpenSpaceVoucher.CollectionStoragePath)
        }

        // It's OK if the account already has a Vault, but we don't want to replace it
        if(signer.borrow<&FUSD.Vault>(from: /storage/fusdVault) != nil) {
          return
        }
      
        // Create a new FUSD Vault and put it in storage
        signer.save(<-FUSD.createEmptyVault(), to: /storage/fusdVault)
    
        // Create a public capability to the Vault that only exposes
        // the deposit function through the Receiver interface
        signer.link<&FUSD.Vault{FungibleToken.Receiver}>(
          /public/fusdReceiver,
          target: /storage/fusdVault
        )
    
        // Create a public capability to the Vault that only exposes
        // the balance field through the Balance interface
        signer.link<&FUSD.Vault{FungibleToken.Balance}>(
          /public/fusdBalance,
          target: /storage/fusdVault
        )
    }
}
`

export const setupOpenSpaceAccount = async (
  admin: FlowAccount,
  user: FlowAccount
) => {
  return await user.sendTx({
    transaction: SETUP_OPEN_SPACE_ACCOUNT(admin.getAddress()),
    args: [],
  })
}
