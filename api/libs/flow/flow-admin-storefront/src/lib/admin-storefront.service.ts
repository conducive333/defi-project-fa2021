import { FlowTypes, FlowService } from '@api/flow/flow-service'
import { FlowAuthService } from '@api/flow/flow-auth'
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import { AdminListingDto } from './dto/admin-listing.dto'
import * as transactions from './transactions'
import * as scripts from './scripts'
import * as cdcTypes from '@onflow/types'
import * as fcl from '@onflow/fcl'

@Injectable()
export class AdminStorefrontService {
  protected readonly nonFungibleTokenAddress: string
  protected readonly fungibleTokenAddress: string
  protected readonly storefrontAddress: string
  protected readonly flowTokenAddress: string
  protected readonly contractName: string
  protected readonly devAddress: string

  constructor(
    private readonly flowAuthorizer: FlowAuthService,
    private readonly configService: ConfigService
  ) {
    this.devAddress = this.configService.get<string>('FLOW_DEV_ADDRESS')
    this.contractName = this.configService.get<string>('FLOW_NFT_CONTRACT')
    this.storefrontAddress = this.configService.get<string>(
      'FLOW_STOREFRONT_ADDRESS'
    )
    this.fungibleTokenAddress =
      this.configService.get<string>('FLOW_FT_ADDRESS')
    this.nonFungibleTokenAddress =
      this.configService.get<string>('FLOW_NFT_ADDRESS')
    this.flowTokenAddress = this.configService.get<string>('FLOW_TOKEN_ADDRESS')
  }

  async sell(
    saleItemPrice: string,
    creatorAddress: string,
    creatorPercent: number,
    metadata: FlowTypes.SimpleDictionary
  ): Promise<FlowTypes.TransactionStatus> {
    const devAuth = await this.flowAuthorizer.developerAuthenticate(0)
    const trsAuth = await this.flowAuthorizer.treasuryAuthenticate()
    const cadenceCode = transactions.sell(
      this.contractName,
      this.devAddress,
      this.nonFungibleTokenAddress,
      this.fungibleTokenAddress,
      this.flowTokenAddress,
      this.devAddress
    )
    const [meta, metaTypes] = FlowService.convertObject(metadata)
    const transaction = await FlowService.sendTx({
      transaction: cadenceCode,
      args: [
        fcl.arg(fcl.withPrefix(creatorAddress), cdcTypes.Address),
        fcl.arg(Number(saleItemPrice).toFixed(8).toString(), cdcTypes.UFix64),
        fcl.arg(Number(creatorPercent).toFixed(8).toString(), cdcTypes.UFix64),
        fcl.arg(meta, metaTypes),
      ],
      authorizations: [devAuth],
      payer: trsAuth,
      proposer: devAuth,
    })
    return transaction
  }

  async remove(
    listingResourceId: string
  ): Promise<FlowTypes.TransactionStatus> {
    const devAuth = await this.flowAuthorizer.developerAuthenticate(0)
    const trsAuth = await this.flowAuthorizer.treasuryAuthenticate()
    const cadenceCode = transactions.remove(this.devAddress)
    const transaction = await FlowService.sendTx({
      transaction: cadenceCode,
      args: [fcl.arg(parseInt(listingResourceId), cdcTypes.UInt64)],
      authorizations: [devAuth],
      payer: trsAuth,
      proposer: devAuth,
    })
    return transaction
  }

  async clean(
    listingResourceId: string,
    storefrontAddress: string
  ): Promise<FlowTypes.TransactionStatus> {
    const devAuth = await this.flowAuthorizer.developerAuthenticate(0)
    const trsAuth = await this.flowAuthorizer.treasuryAuthenticate()
    const cadenceCode = transactions.clean(this.devAddress)
    const transaction = await FlowService.sendTx({
      transaction: cadenceCode,
      args: [
        fcl.arg(parseInt(listingResourceId), cdcTypes.UInt64),
        fcl.arg(storefrontAddress, cdcTypes.Address),
      ],
      authorizations: [devAuth],
      payer: trsAuth,
      proposer: devAuth,
    })
    return transaction
  }

  async getSaleOffers(
    limit: number,
    offset: number
  ): Promise<AdminListingDto[]> {
    if (!Number.isInteger(limit) || limit < 0)
      throw new Error('limit must be a nonnegative integer.')
    if (!Number.isInteger(offset) || offset < 0)
      throw new Error('offset must be a nonnegative integer.')
    return await FlowService.executeScript({
      script: scripts.getSaleOffers(this.devAddress),
      args: [
        fcl.arg(this.devAddress, cdcTypes.Address),
        fcl.arg(limit, cdcTypes.Int),
        fcl.arg(offset, cdcTypes.Int),
      ],
    })
  }

  async getSaleOffer(listingResourceID: number): Promise<AdminListingDto> {
    if (!Number.isInteger(listingResourceID))
      throw new Error('listingResourceID must be an integer.')
    return await FlowService.executeScript({
      script: scripts.getSaleOffer(this.devAddress),
      args: [
        fcl.arg(this.devAddress, cdcTypes.Address),
        fcl.arg(listingResourceID, cdcTypes.UInt64),
      ],
    })
  }

  async hasStorefront(address: string): Promise<boolean> {
    return await FlowService.executeScript({
      script: scripts.hasStorefront(this.devAddress),
      args: [fcl.arg(address, cdcTypes.Address)],
    })
  }

  async hasSaleOffer(listingResourceID: number): Promise<boolean> {
    return await FlowService.executeScript({
      script: scripts.hasSaleOffer(this.storefrontAddress),
      args: [
        fcl.arg(this.devAddress, cdcTypes.Address),
        fcl.arg(listingResourceID, cdcTypes.UInt64),
      ],
    })
  }
}
