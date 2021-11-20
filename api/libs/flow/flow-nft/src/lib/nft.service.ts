import { Injectable } from '@nestjs/common'
import { NftType } from './nft.types'
import * as scripts from './scripts'
import {
  FlowAccountService,
  FlowService,
  wrapAddress,
  wrapUInt64,
} from '@api/flow/flow-utils'

@Injectable()
export class NftService {
  protected readonly devAddress: string
  protected readonly nftAddress: string

  constructor(private readonly flowAccountService: FlowAccountService) {
    this.devAddress = this.flowAccountService.config.FLOW_DEV_ADDRESS
    this.nftAddress = this.flowAccountService.config.FLOW_NFT_ADDRESS
  }

  async getNftId(address: string, uuid: string): Promise<number> {
    return await FlowService.sendScript({
      script: scripts.getId(this.devAddress, this.nftAddress),
      args: [wrapAddress(address), wrapAddress(uuid)],
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
    return await FlowService.sendScript({
      script: scripts.getCollectionUUIDs(this.devAddress, this.nftAddress),
      args: [wrapAddress(address), wrapUInt64(limit), wrapUInt64(offset)],
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
    return await FlowService.sendScript({
      script: scripts.getCollection(this.devAddress, this.nftAddress),
      args: [wrapAddress(address), wrapUInt64(limit), wrapUInt64(offset)],
    })
  }

  async hasCollection(address: string): Promise<boolean> {
    return await FlowService.sendScript({
      script: scripts.hasCollection(this.devAddress, this.nftAddress),
      args: [wrapAddress(address)],
    })
  }
}
