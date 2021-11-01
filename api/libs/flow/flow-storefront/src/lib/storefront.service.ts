import { FlowService } from '@api/flow/flow-service'
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import * as scripts from './scripts'
import * as cdcTypes from '@onflow/types'
import * as fcl from '@onflow/fcl'
import { ListingDto } from './dto/listing.dto'

@Injectable()
export class FlowStorefrontService {
  protected readonly nonFungibleTokenAddress: string
  protected readonly fungibleTokenAddress: string
  protected readonly storefrontAddress: string
  protected readonly flowTokenAddress: string
  protected readonly devAddress: string

  constructor(private readonly configService: ConfigService) {
    this.devAddress = this.configService.get<string>('FLOW_DEV_ADDRESS')
    this.storefrontAddress = this.configService.get<string>(
      'FLOW_STOREFRONT_ADDRESS'
    )
    this.fungibleTokenAddress =
      this.configService.get<string>('FLOW_FT_ADDRESS')
    this.nonFungibleTokenAddress =
      this.configService.get<string>('FLOW_NFT_ADDRESS')
    this.flowTokenAddress = this.configService.get<string>('FLOW_TOKEN_ADDRESS')
  }

  async getSaleOffers(
    address: string,
    limit: number,
    offset: number
  ): Promise<string[]> {
    if (!Number.isInteger(limit) || limit < 0)
      throw new Error('limit must be a nonnegative integer.')
    if (!Number.isInteger(offset) || offset < 0)
      throw new Error('offset must be a nonnegative integer.')
    return await FlowService.executeScript({
      script: scripts.getSaleOffers(
        this.devAddress,
        this.nonFungibleTokenAddress
      ),
      args: [
        fcl.arg(address, cdcTypes.Address),
        fcl.arg(limit, cdcTypes.UInt64),
        fcl.arg(offset, cdcTypes.UInt64),
      ],
    })
  }

  async getSaleOffer(
    address: string,
    openSpaceItemId: string
  ): Promise<ListingDto> {
    return await FlowService.executeScript({
      script: scripts.getSaleOffer(
        this.devAddress,
        this.nonFungibleTokenAddress
      ),
      args: [
        fcl.arg(address, cdcTypes.Address),
        fcl.arg(openSpaceItemId, cdcTypes.String),
      ],
    })
  }

  async hasStorefront(address: string): Promise<boolean> {
    return await FlowService.executeScript({
      script: scripts.hasStorefront(this.storefrontAddress),
      args: [fcl.arg(address, cdcTypes.Address)],
    })
  }
}
