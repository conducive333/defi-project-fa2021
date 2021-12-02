import {
  FlowAccountService,
  FlowService,
  TransactionStatus,
  wrapAddress,
  wrapObjects,
  wrapString,
  wrapUFix64,
} from '@api/flow/flow-utils'
import { AdminListingDto } from './dto/admin-listing.dto'
import { NftMetadata } from '@api/flow/flow-nft'
import * as transactions from './transactions'
import { Injectable } from '@nestjs/common'
import * as scripts from './scripts'

@Injectable()
export class AdminStorefrontService {
  protected readonly fungibleTokenAddress: string
  protected readonly storefrontAddress: string
  protected readonly flowTokenAddress: string
  protected readonly devAddress: string
  protected readonly nftAddress: string

  constructor(private readonly flowAccountService: FlowAccountService) {
    this.devAddress = this.flowAccountService.config.FLOW_DEV_ADDRESS
    this.nftAddress = this.flowAccountService.config.FLOW_NFT_ADDRESS
    this.fungibleTokenAddress = this.flowAccountService.config.FLOW_FT_ADDRESS
    this.flowTokenAddress = this.flowAccountService.config.FLOW_TOKEN_ADDRESS
  }

  async sell(
    setId: string,
    packId: string,
    saleItemPrice: number,
    beneficiaryAddress: string,
    beneficiaryPercent: number,
    metadatas: NftMetadata[]
  ): Promise<TransactionStatus> {
    return await this.flowAccountService.sendTx({
      transaction: transactions.sell(
        this.devAddress,
        this.nftAddress,
        this.fungibleTokenAddress,
        this.flowTokenAddress
      ),
      args: [
        wrapString(setId),
        wrapString(packId),
        wrapUFix64(saleItemPrice),
        wrapObjects(metadatas),
        wrapAddress(beneficiaryAddress),
        wrapUFix64(beneficiaryPercent),
      ],
    })
  }

  async remove(setId: string, packId: string): Promise<TransactionStatus> {
    return await this.flowAccountService.sendTx({
      transaction: transactions.remove(this.devAddress),
      args: [wrapString(setId), wrapString(packId)],
    })
  }

  async borrowListing(setId: string, packId: string): Promise<AdminListingDto> {
    return await FlowService.sendScript({
      script: scripts.borrowListing(this.devAddress),
      args: [
        wrapAddress(this.devAddress),
        wrapString(setId),
        wrapString(packId),
      ],
    })
  }

  async borrowListings(setId: string): Promise<string[]> {
    return await FlowService.sendScript({
      script: scripts.borrowListings(this.devAddress),
      args: [wrapAddress(this.devAddress), wrapString(setId)],
    })
  }
}
