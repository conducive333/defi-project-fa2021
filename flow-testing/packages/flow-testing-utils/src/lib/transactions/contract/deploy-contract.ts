import {
  FlowAccount,
  sendTransaction,
  wrapContract,
  wrapString,
} from '@flow-testing/flow-testing-utils'

const DEPLOY_CONTRACT = `
transaction(contractName: String, contractCode: String) {
  prepare(signer: AuthAccount) {
    signer.contracts.add(name: contractName, code: contractCode.decodeHex())
  }
}
`

export const deployContract = async (
  account: FlowAccount,
  name: string,
  code: string
) => {
  return await sendTransaction({
    transaction: DEPLOY_CONTRACT,
    args: [wrapString(name), wrapContract(code)],
    authorizations: [account.authz],
    payer: account.authz,
    proposer: account.authz,
  })
}
