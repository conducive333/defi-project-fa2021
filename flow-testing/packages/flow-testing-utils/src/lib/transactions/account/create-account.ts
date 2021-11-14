import {
  CONSTANTS,
  sendTransaction,
  wrapStringArray,
} from '@flow-testing/flow-testing-utils'
import { getAuthorizer } from '../../auth'

const CREATE_ACCOUNT = `
transaction(keys: [String]) {
  prepare(signer: AuthAccount) {
    let acct = AuthAccount(payer: signer)
    for key in keys {
      acct.addPublicKey(key.decodeHex())
    }
  }
}
`

export const createAccount = async (key: string) => {
  const emAuth = getAuthorizer(
    CONSTANTS.EMULATOR_ADDRESS,
    CONSTANTS.EMULATOR_PRIVATE_KEY
  )
  return await sendTransaction({
    transaction: CREATE_ACCOUNT,
    args: [wrapStringArray([key])],
    authorizations: [emAuth],
    payer: emAuth,
    proposer: emAuth,
  })
}
