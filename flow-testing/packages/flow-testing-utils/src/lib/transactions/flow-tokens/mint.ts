import {
  FlowAccount,
  sendTransaction,
  wrapUFix64,
} from '@flow-testing/flow-testing-utils'
import { getAuthorizer } from '../../auth'
import { CONSTANTS } from '../../constants'

const MINT_FLOW = `
import FungibleToken from ${CONSTANTS.FUNGIBLE_TOKEN_ADDRESS}
import FlowToken from ${CONSTANTS.FLOW_TOKEN_ADDRESS}

transaction(recipient: Address, amount: UFix64) {
    let tokenAdmin: &FlowToken.Administrator
    let tokenReceiver: &{FungibleToken.Receiver}

    prepare(signer: AuthAccount) {

        self.tokenAdmin = signer
            .borrow<&FlowToken.Administrator>(from: /storage/flowTokenAdmin)
            ?? panic("Signer is not the token admin")

        self.tokenReceiver = getAccount(recipient)
            .getCapability(/public/flowTokenReceiver)
            .borrow<&{FungibleToken.Receiver}>()
            ?? panic("Unable to borrow receiver reference")
    }

    execute {
        let minter <- self.tokenAdmin.createNewMinter(allowedAmount: amount)
        let mintedVault <- minter.mintTokens(amount: amount)

        self.tokenReceiver.deposit(from: <-mintedVault)

        destroy minter
    }
}
`

export const mintFlow = async (account: FlowAccount, amount: number) => {
  const authz = getAuthorizer(
    CONSTANTS.EMULATOR_ADDRESS,
    CONSTANTS.EMULATOR_PRIVATE_KEY
  )
  return await sendTransaction({
    transaction: MINT_FLOW,
    args: [account.getAddress(true), wrapUFix64(amount)],
    authorizations: [authz],
    payer: authz,
    proposer: authz,
  })
}
