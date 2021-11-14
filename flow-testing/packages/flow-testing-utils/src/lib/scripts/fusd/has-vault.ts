import { FlowAccount, sendScript } from '@flow-testing/flow-testing-utils'
import { CONSTANTS } from '../../constants'

const HAS_FUSD_VAULT = `
import FungibleToken from ${CONSTANTS.FUNGIBLE_TOKEN_ADDRESS}
import FUSD from ${CONSTANTS.FUSD_ADDRESS}

pub fun main(address: Address): Bool {
  return getAccount(address).getCapability<&FUSD.Vault{FungibleToken.Balance}>(/public/fusdBalance).check()
}
`

export const hasFUSDVault = async (account: FlowAccount): Promise<boolean> => {
  return await sendScript({
    script: HAS_FUSD_VAULT,
    args: [account.getAddress(true)],
  })
}
