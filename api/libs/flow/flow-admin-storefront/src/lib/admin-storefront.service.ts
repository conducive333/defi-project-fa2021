import { FlowTypes, FlowService } from '@api/flow/flow-service'
import { AdminListingDto } from './dto/admin-listing.dto'
import { FlowAuthService } from '@api/flow/flow-auth'
import { NftMetadata } from '@api/flow/flow-nft'
import * as transactions from './transactions'
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import * as cdcTypes from '@onflow/types'
import * as scripts from './scripts'
import * as fcl from '@onflow/fcl'

@Injectable()
export class AdminStorefrontService {
  protected readonly nonFungibleTokenAddress: string
  protected readonly fungibleTokenAddress: string
  protected readonly storefrontAddress: string
  protected readonly flowTokenAddress: string
  protected readonly devAddress: string

  constructor(
    private readonly flowAuthorizer: FlowAuthService,
    private readonly configService: ConfigService
  ) {
    this.devAddress = this.configService.get<string>('FLOW_DEV_ADDRESS')
    this.fungibleTokenAddress =
      this.configService.get<string>('FLOW_FT_ADDRESS')
    this.nonFungibleTokenAddress =
      this.configService.get<string>('FLOW_NFT_ADDRESS')
    this.flowTokenAddress = this.configService.get<string>('FLOW_TOKEN_ADDRESS')
  }

  async sell(
    setId: string,
    packId: string,
    saleItemPrice: number,
    beneficiaryAddress: string,
    beneficiaryPercent: number,
    metadatas: NftMetadata[]
  ): Promise<FlowTypes.TransactionStatus> {
    const devAuth = await this.flowAuthorizer.developerAuthenticate(0)
    const trsAuth = await this.flowAuthorizer.treasuryAuthenticate()
    const cadenceCode = transactions.sell(
      this.devAddress,
      this.nonFungibleTokenAddress,
      this.fungibleTokenAddress,
      this.flowTokenAddress,
    )
    const [meta, metaTypes] = FlowService.convertObjects(metadatas)
    const transaction = await FlowService.sendTx({
      transaction: cadenceCode,
      args: [
        fcl.arg(setId, cdcTypes.String),
        fcl.arg(packId, cdcTypes.String),
        fcl.arg(saleItemPrice.toFixed(8).toString(), cdcTypes.UFix64),
        fcl.arg(meta, metaTypes),
        fcl.arg(fcl.withPrefix(beneficiaryAddress), cdcTypes.Address),
        fcl.arg(beneficiaryPercent.toFixed(8).toString(), cdcTypes.UFix64),
      ],
      authorizations: [devAuth],
      payer: trsAuth,
      proposer: devAuth,
    })
    return transaction
  }

  async remove(
    setId: string,
    packId: string
  ): Promise<FlowTypes.TransactionStatus> {
    const devAuth = await this.flowAuthorizer.developerAuthenticate(0)
    const trsAuth = await this.flowAuthorizer.treasuryAuthenticate()
    const cadenceCode = transactions.remove(this.devAddress)
    const transaction = await FlowService.sendTx({
      transaction: cadenceCode,
      args: [fcl.arg(setId, cdcTypes.String), fcl.arg(packId, cdcTypes.String)],
      authorizations: [devAuth],
      payer: trsAuth,
      proposer: devAuth,
    })
    return transaction
  }

  async borrowListing(setId: string, packId: string): Promise<AdminListingDto> {
    return await FlowService.executeScript({
      script: scripts.borrowListing(this.devAddress),
      args: [
        fcl.arg(this.devAddress, cdcTypes.Address),
        fcl.arg(setId, cdcTypes.String),
        fcl.arg(packId, cdcTypes.String),
      ],
    })
  }

  async borrowListings(
    setId: string
  ): Promise<Record<string, AdminListingDto>> {
    return await FlowService.executeScript({
      script: scripts.borrowListings(this.devAddress),
      args: [
        fcl.arg(this.devAddress, cdcTypes.Address),
        fcl.arg(setId, cdcTypes.String),
      ],
    })
  }

  async getPackIds(setId: string): Promise<string[]> {
    return await FlowService.executeScript({
      script: scripts.getPackIds(this.devAddress),
      args: [
        fcl.arg(this.devAddress, cdcTypes.Address),
        fcl.arg(setId, cdcTypes.String),
      ],
    })
  }

  async getSetIds(): Promise<string[]> {
    return await FlowService.executeScript({
      script: scripts.getSetIds(this.devAddress),
      args: [fcl.arg(this.devAddress, cdcTypes.Address)],
    })
  }

  async hasListing(setId: string, packId: string): Promise<boolean> {
    return await FlowService.executeScript({
      script: scripts.hasListing(this.devAddress),
      args: [
        fcl.arg(this.devAddress, cdcTypes.Address),
        fcl.arg(setId, cdcTypes.String),
        fcl.arg(packId, cdcTypes.String),
      ],
    })
  }

  async hasStorefront(address: string): Promise<boolean> {
    return await FlowService.executeScript({
      script: scripts.hasStorefront(this.devAddress),
      args: [fcl.arg(address, cdcTypes.Address)],
    })
  }
}
