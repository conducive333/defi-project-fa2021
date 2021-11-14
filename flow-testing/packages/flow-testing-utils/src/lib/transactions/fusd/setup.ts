import { FlowAccount, sendTransaction } from '@flow-testing/flow-testing-utils'
import { CONSTANTS } from '../../constants'

const SETUP_FUSD_VAULT = `
import FungibleToken from ${CONSTANTS.FUNGIBLE_TOKEN_ADDRESS}
import FUSD from ${CONSTANTS.FUSD_ADDRESS}

transaction {

  prepare(signer: AuthAccount) {

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

export const setupFUSDVault = async (account: FlowAccount) => {
  return await sendTransaction({
    transaction: SETUP_FUSD_VAULT,
    args: [],
    authorizations: [account.authz],
    payer: account.authz,
    proposer: account.authz,
  })
}
