import { FlowAuthService } from '../auth/authorizer.service'
import { FlowService } from '../flow/flow.service'
import { wrapAddress } from '../utils/wrappers'
import { keyCount } from './scripts/key-count'
import { TxArgs } from '../types/onflow.types'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FlowAccountService {
  private static readonly MASTER_KEY_INDEX = 0
  private readonly devAddr: string
  private readonly trsAddr: string
  constructor(
    private readonly flowAuthService: FlowAuthService,
    public readonly flowService: FlowService
  ) {
    this.devAddr = this.flowService.config.FLOW_DEV_ADDRESS
    this.trsAddr = this.flowService.config.FLOW_TREASURY_ADDRESS
  }

  get config() {
    return this.flowService.config
  }

  async sendTx(
    { transaction, args }: TxArgs,
    keyIndex = FlowAccountService.MASTER_KEY_INDEX
  ) {
    const prpAuth = await this.flowAuthService.authz(this.devAddr, keyIndex)
    const devAuth = await this.flowAuthService.authz(
      this.devAddr,
      FlowAccountService.MASTER_KEY_INDEX
    )
    const trsAuth = await this.flowAuthService.authz(
      this.trsAddr,
      FlowAccountService.MASTER_KEY_INDEX
    )
    return await FlowService.sendTransaction({
      transaction,
      args,
      authorizations: [devAuth],
      payer: trsAuth,
      proposer: prpAuth,
    })
  }

  async countKeys(): Promise<number> {
    return await FlowService.sendScript({
      script: keyCount(),
      args: [wrapAddress(this.devAddr)],
    })
  }
}
