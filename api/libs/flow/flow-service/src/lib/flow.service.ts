import { keyCount } from './scripts/key-count'
import * as FlowTypes from './flow.base.types'
import * as cdcTypes from '@onflow/types'
import * as fcl from '@onflow/fcl'
import * as sdk from '@onflow/sdk'

export class FlowService {
  public static convertObject = (obj: FlowTypes.SimpleDictionary) => {
    const flowMeta: FlowTypes.SimpleDictionary[] = []
    const typeMeta: Record<string, unknown>[] = []
    for (const prop in obj) {
      flowMeta.push({ key: prop, value: obj[prop].toString() })
      typeMeta.push({ key: cdcTypes.String, value: cdcTypes.String })
    }
    return [flowMeta, cdcTypes.Dictionary(typeMeta)]
  }

  public static convertObjects = (objs: FlowTypes.SimpleDictionary[]) => {
    const flowMetas: FlowTypes.SimpleDictionary[][] = []
    const typeMetas: unknown[][] = []
    for (const obj of objs) {
      const [flowMeta, typeMeta] = FlowService.convertObject(obj)
      flowMetas.push(flowMeta)
      typeMetas.push(typeMeta)
    }
    return [flowMetas, cdcTypes.Array(typeMetas)]
  }

  public static setAccessNode = (flowAccessApi: string) => {
    fcl.config().put('accessNode.api', flowAccessApi)
  }

  public static getAccount = async (
    addr: string
  ): Promise<FlowTypes.Account> => {
    const { account } = await fcl.send([fcl.getAccount(addr)])
    return account
  }

  public static countKeys = async (
    address: string
  ): Promise<number | undefined> => {
    return await FlowService.executeScript({
      script: keyCount(),
      args: [fcl.arg(address, cdcTypes.Address)],
    })
  }

  public static formatEvent = (
    address: string,
    smartContract: string,
    event: string
  ) => {
    return `A.${fcl.sansPrefix(address)}.${smartContract}.${event}`
  }

  public static sendTx = async ({
    transaction,
    args,
    proposer,
    authorizations,
    payer,
  }) => {
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

  public static executeScript = async ({ script, args }) => {
    const response = await fcl.send([fcl.script`${script}`, fcl.args(args)])
    return await fcl.decode(response)
  }

  public static getLatestBlock = async (): Promise<FlowTypes.Block> => {
    const block = await sdk.send(sdk.build([sdk.getBlock(true)]))
    const decoded = await sdk.decode(block)
    return decoded
  }

  public static ping = async (): Promise<FlowTypes.Ping> => {
    return await fcl.send([fcl.ping()])
  }

  public static getTransaction = async (
    transactionId: string
  ): Promise<FlowTypes.Transaction> => {
    return await fcl.send([fcl.getTransactionStatus(transactionId)])
  }
}
