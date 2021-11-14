import { SendScriptArgs, SendTxArgs, TransactionStatus } from './types/utils'
import * as fcl from '@onflow/fcl'

export const setAccessNode = (flowAccessApi: string) => {
  fcl.config().put('accessNode.api', flowAccessApi)
}

export const sendTransaction = async ({
  transaction,
  args,
  proposer,
  authorizations,
  payer,
}: SendTxArgs): Promise<TransactionStatus> => {
  const response = await fcl.send([
    fcl.transaction`
      ${transaction}
    `,
    fcl.args(args),
    fcl.proposer(proposer),
    fcl.authorizations(authorizations),
    fcl.payer(payer),
    fcl.limit(9999),
  ])
  return await fcl.tx(response).onceSealed()
}

export const sendScript = async ({ script, args }: SendScriptArgs) => {
  const response = await fcl.send([fcl.script`${script}`, fcl.args(args)])
  return await fcl.decode(response)
}
