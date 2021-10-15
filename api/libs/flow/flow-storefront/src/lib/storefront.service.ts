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
  ): Promise<ListingDto[]> {
    if (!Number.isInteger(limit) || limit < 0)
      throw new Error('limit must be a nonnegative integer.')
    if (!Number.isInteger(offset) || offset < 0)
      throw new Error('offset must be a nonnegative integer.')
    return await FlowService.executeScript({
      script: scripts.getSaleOffers(this.storefrontAddress),
      args: [
        fcl.arg(address, cdcTypes.Address),
        fcl.arg(limit, cdcTypes.Int),
        fcl.arg(offset, cdcTypes.Int),
      ],
    })
  }

  async getSaleOffer(
    address: string,
    listingResourceID: number
  ): Promise<ListingDto> {
    if (!Number.isInteger(listingResourceID))
      throw new Error('listingResourceID must be an integer.')
    if (listingResourceID < 0 || listingResourceID > 2 ** 64 - 1)
      throw new Error(
        'listingResourceID must be in the interval [0, 18446744073709551615]'
      )
    return await FlowService.executeScript({
      script: scripts.getSaleOffer(this.storefrontAddress),
      args: [
        fcl.arg(address, cdcTypes.Address),
        fcl.arg(listingResourceID, cdcTypes.UInt64),
      ],
    })
  }

  async hasStorefront(address: string): Promise<boolean> {
    return await FlowService.executeScript({
      script: scripts.hasStorefront(this.storefrontAddress),
      args: [fcl.arg(address, cdcTypes.Address)],
    })
  }

  async hasSaleOffer(
    address: string,
    listingResourceID: number
  ): Promise<boolean> {
    return await FlowService.executeScript({
      script: scripts.hasSaleOffer(this.storefrontAddress),
      args: [
        fcl.arg(address, cdcTypes.Address),
        fcl.arg(listingResourceID, cdcTypes.UInt64),
      ],
    })
  }
}
