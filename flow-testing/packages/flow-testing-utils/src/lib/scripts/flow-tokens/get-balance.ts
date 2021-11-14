import { FlowAccount, sendScript } from '@flow-testing/flow-testing-utils'
import { CONSTANTS } from '../../constants'

const GET_FLOW_BALANCE = `
import FungibleToken from ${CONSTANTS.FUNGIBLE_TOKEN_ADDRESS}
import FlowToken from ${CONSTANTS.FLOW_TOKEN_ADDRESS}

pub fun main(address: Address): UFix64 {
  let vaultRef = getAccount(address)
    .getCapability(/public/flowTokensBalance)!
    .borrow<&FlowToken.Vault{FungibleToken.Balance}>()
  if vaultRef != nil {
    return vaultRef!.balance
  }
  return 0.0
`

export const getFlowBalance = async (account: FlowAccount): Promise<number> => {
  return await sendScript({
    script: GET_FLOW_BALANCE,
    args: [account.getAddress(true)],
  })
}
