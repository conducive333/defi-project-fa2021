import {
  Account,
  Block,
  FullTxArgs,
  ScriptArgs,
  Transaction,
  TransactionStatus,
} from '../types/onflow.types'
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import * as fcl from '@onflow/fcl'
import * as sdk from '@onflow/sdk'

@Injectable()
export class FlowService {
  public readonly config: {
    FLOW_TOKEN_ADDRESS: string
    FLOW_FEES_ADDRESS: string
    FLOW_FT_ADDRESS: string
    FLOW_FUSD_ADDRESS: string
    FLOW_NFT_ADDRESS: string
    FLOW_DEV_ADDRESS: string
    FLOW_TREASURY_ADDRESS: string
  }

  constructor(configService: ConfigService) {
    fcl
      .config()
      .put('accessNode.api', configService.get<string>('FLOW_ACCESS_API')!)
    this.config = {
      FLOW_TOKEN_ADDRESS: configService.get<string>('FLOW_TOKEN_ADDRESS')!,
      FLOW_FEES_ADDRESS: configService.get<string>('FLOW_FEES_ADDRESS')!,
      FLOW_FT_ADDRESS: configService.get<string>('FLOW_FT_ADDRESS')!,
      FLOW_FUSD_ADDRESS: configService.get<string>('FLOW_FUSD_ADDRESS')!,
      FLOW_NFT_ADDRESS: configService.get<string>('FLOW_NFT_ADDRESS')!,
      FLOW_DEV_ADDRESS: configService.get<string>('FLOW_DEV_ADDRESS')!,
      FLOW_TREASURY_ADDRESS: configService.get<string>(
        'FLOW_TREASURY_ADDRESS'
      )!,
    }
  }

  static async sendTransaction({
    transaction,
    args,
    proposer,
    authorizations,
    payer,
  }: FullTxArgs): Promise<TransactionStatus> {
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

  static async sendScript({ script, args }: ScriptArgs) {
    const response = await fcl.send([fcl.script`${script}`, fcl.args(args)])
    return await fcl.decode(response)
  }

  static async getAccount(address: string): Promise<Account> {
    const { account } = await fcl.send([fcl.getAccount(address)])
    return account
  }

  static async getLatestBlock(): Promise<Block> {
    const block = await sdk.send(sdk.build([sdk.getBlock(true)]))
    const decoded = await sdk.decode(block)
    return decoded
  }

  static async getTransaction(transactionId: string): Promise<Transaction> {
    return await fcl.send([fcl.getTransactionStatus(transactionId)])
  }

  static formatEvent(address: string, smartContract: string, event: string) {
    return `A.${fcl.sansPrefix(address)}.${smartContract}.${event}`
  }
}
