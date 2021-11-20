import * as transactions from './transactions'
import { Injectable } from '@nestjs/common'
import {
  FlowAccountService,
  wrapAddress,
  wrapUInt64,
} from '@api/flow/flow-utils'

@Injectable()
export class FlowVoucherService {
  protected readonly devAddress: string
  protected readonly nftAddress: string

  constructor(private readonly flowAccountService: FlowAccountService) {
    this.devAddress = this.flowAccountService.config.FLOW_DEV_ADDRESS
    this.nftAddress = this.flowAccountService.config.FLOW_NFT_ADDRESS
  }

  async mint(keyIndex: number, address: string, count: number) {
    return await this.flowAccountService.sendTx(
      {
        transaction: transactions.mintVoucher(this.devAddress, this.nftAddress),
        args: [wrapAddress(address), wrapUInt64(count)],
      },
      keyIndex
    )
  }
}
