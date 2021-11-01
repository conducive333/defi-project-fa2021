import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import { FlowService } from '@api/flow/flow-service'
import { NftType } from './nft.types'
import * as cdcTypes from '@onflow/types'
import * as scripts from './scripts'
import * as fcl from '@onflow/fcl'

@Injectable()
export class NftService {
  protected readonly devAddress: string
  protected readonly nftAddress: string

  constructor(private readonly configService: ConfigService) {
    this.devAddress = this.configService.get<string>('FLOW_DEV_ADDRESS')
    this.nftAddress = this.configService.get<string>('FLOW_NFT_ADDRESS')
  }

  async getNftId(address: string, uuid: string): Promise<number> {
    return await FlowService.executeScript({
      script: scripts.getId(this.devAddress, this.nftAddress),
      args: [
        fcl.arg(address, cdcTypes.Address),
        fcl.arg(uuid, cdcTypes.String),
      ],
    })
  }

  async getCollectionUUIDs(
    address: string,
    limit: number,
    offset: number
  ): Promise<string[]> {
    if (!Number.isInteger(limit) || limit < 0)
      throw new Error('limit must be a nonnegative integer.')
    if (!Number.isInteger(offset) || offset < 0)
      throw new Error('offset must be a nonnegative integer.')
    return await FlowService.executeScript({
      script: scripts.getCollectionUUIDs(this.devAddress, this.nftAddress),
      args: [
        fcl.arg(address, cdcTypes.Address),
        fcl.arg(limit, cdcTypes.UInt64),
        fcl.arg(offset, cdcTypes.UInt64),
      ],
    })
  }

  async getCollection(
    address: string,
    limit: number,
    offset: number
  ): Promise<NftType[]> {
    if (!Number.isInteger(limit) || limit < 0)
      throw new Error('limit must be a nonnegative integer.')
    if (!Number.isInteger(offset) || offset < 0)
      throw new Error('offset must be a nonnegative integer.')
    return await FlowService.executeScript({
      script: scripts.getCollection(this.devAddress, this.nftAddress),
      args: [
        fcl.arg(address, cdcTypes.Address),
        fcl.arg(limit, cdcTypes.UInt64),
        fcl.arg(offset, cdcTypes.UInt64),
      ],
    })
  }

  async hasCollection(address: string): Promise<boolean> {
    return await FlowService.executeScript({
      script: scripts.hasCollection(this.devAddress, this.nftAddress),
      args: [fcl.arg(address, cdcTypes.Address)],
    })
  }
}
