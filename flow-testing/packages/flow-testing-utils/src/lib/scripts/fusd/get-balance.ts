import { FlowAccount, sendScript } from '@flow-testing/flow-testing-utils'
import { CONSTANTS } from '../../constants'

const GET_FUSD_BALANCE = `
import FungibleToken from ${CONSTANTS.FUNGIBLE_TOKEN_ADDRESS}
import FUSD from ${CONSTANTS.FUSD_ADDRESS}

pub fun main(address: Address): UFix64 {
  let vaultRef = getAccount(address)
    .getCapability(/public/fusdBalance)!
    .borrow<&FUSD.Vault{FungibleToken.Balance}>()
  if vaultRef != nil {
    return vaultRef!.balance
  }
  return 0.0
}
`

export const getFUSDBalance = async (account: FlowAccount): Promise<number> => {
  return await sendScript({
    script: GET_FUSD_BALANCE,
    args: [account.getAddress(true)],
  })
}
