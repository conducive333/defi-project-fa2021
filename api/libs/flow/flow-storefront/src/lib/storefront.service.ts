import { FlowAuthService } from '@doosan/flow/flow-auth'
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import * as transactions from './transactions'
import * as scripts from './scripts'
import * as cdcTypes from '@onflow/types'
import * as fcl from '@onflow/fcl'
import { FlowTypes, FlowService } from '@doosan/flow/flow-service'
import { SaleOffer } from './storefront.types'

@Injectable()
export class StorefrontService {
  protected readonly fungibleTokenAddress: string
  protected readonly flowTokenAddress: string
  protected readonly devAddress: string

  constructor(
    private readonly flowAuthorizer: FlowAuthService,
    private readonly configService: ConfigService
  ) {
    this.devAddress = this.configService.get<string>('FLOW_DEV_ADDRESS')
    this.fungibleTokenAddress =
      this.configService.get<string>('FLOW_FT_ADDRESS')
    this.flowTokenAddress = this.configService.get<string>('FLOW_TOKEN_ADDRESS')
  }

  async setup(index: number) {
    const devAuth = await this.flowAuthorizer.developerAuthenticate(index)
    const trsAuth = await this.flowAuthorizer.treasuryAuthenticate()
    const cadenceCode = transactions.setup(this.devAddress)
    const transaction = await FlowService.sendTx({
      transaction: cadenceCode,
      args: [],
      authorizations: [devAuth],
      payer: trsAuth,
      proposer: devAuth,
    })
    return transaction
  }

  async buy(
    index: number,
    saleOfferResourceId: string,
    storefrontAddress: string,
    withdrawMeta: FlowTypes.SimpleDictionary,
    depositMeta: FlowTypes.SimpleDictionary,
    saleOfferCompletedMeta: FlowTypes.SimpleDictionary
  ): Promise<FlowTypes.TransactionStatus> {
    const devAuth = await this.flowAuthorizer.developerAuthenticate(index)
    const trsAuth = await this.flowAuthorizer.treasuryAuthenticate()
    const cadenceCode = transactions.buy(
      this.devAddress,
      this.fungibleTokenAddress,
      this.flowTokenAddress
    )
    const [completed, completedTypes] = FlowService.convertObject(
      saleOfferCompletedMeta
    )
    const [withdraw, withdrawTypes] = FlowService.convertObject(withdrawMeta)
    const [deposit, depositTypes] = FlowService.convertObject(depositMeta)
    const transaction = await FlowService.sendTx({
      transaction: cadenceCode,
      args: [
        fcl.arg(parseInt(saleOfferResourceId), cdcTypes.UInt64),
        fcl.arg(storefrontAddress, cdcTypes.Address),
        fcl.arg(withdraw, withdrawTypes),
        fcl.arg(deposit, depositTypes),
        fcl.arg(completed, completedTypes),
      ],
      authorizations: [devAuth],
      payer: trsAuth,
      proposer: devAuth,
    })
    return transaction
  }

  async sell(
    index: number,
    saleItemId: string,
    saleItemPrice: string,
    saleOfferAvailableMeta: FlowTypes.SimpleDictionary
  ): Promise<FlowTypes.TransactionStatus> {
    const devAuth = await this.flowAuthorizer.developerAuthenticate(index)
    const trsAuth = await this.flowAuthorizer.treasuryAuthenticate()
    const cadenceCode = transactions.sell(
      this.devAddress,
      this.fungibleTokenAddress,
      this.flowTokenAddress
    )
    const [available, availableTypes] = FlowService.convertObject(
      saleOfferAvailableMeta
    )
    const transaction = await FlowService.sendTx({
      transaction: cadenceCode,
      args: [
        fcl.arg(parseInt(saleItemId), cdcTypes.UInt64),
        fcl.arg(Number(saleItemPrice).toFixed(8).toString(), cdcTypes.UFix64),
        fcl.arg(available, availableTypes),
      ],
      authorizations: [devAuth],
      payer: trsAuth,
      proposer: devAuth,
    })
    return transaction
  }

  async remove(
    index: number,
    saleOfferResourceId: string
  ): Promise<FlowTypes.TransactionStatus> {
    const devAuth = await this.flowAuthorizer.developerAuthenticate(index)
    const trsAuth = await this.flowAuthorizer.treasuryAuthenticate()
    const cadenceCode = transactions.remove(this.devAddress)
    const transaction = await FlowService.sendTx({
      transaction: cadenceCode,
      args: [fcl.arg(parseInt(saleOfferResourceId), cdcTypes.UInt64)],
      authorizations: [devAuth],
      payer: trsAuth,
      proposer: devAuth,
    })
    return transaction
  }

  async clean(
    index: number,
    saleOfferResourceId: string,
    storefrontAddress: string
  ): Promise<FlowTypes.TransactionStatus> {
    const devAuth = await this.flowAuthorizer.developerAuthenticate(index)
    const trsAuth = await this.flowAuthorizer.treasuryAuthenticate()
    const cadenceCode = transactions.clean(this.devAddress)
    const transaction = await FlowService.sendTx({
      transaction: cadenceCode,
      args: [
        fcl.arg(parseInt(saleOfferResourceId), cdcTypes.UInt64),
        fcl.arg(storefrontAddress, cdcTypes.Address),
      ],
      authorizations: [devAuth],
      payer: trsAuth,
      proposer: devAuth,
    })
    return transaction
  }

  async getSaleOffers(
    address: string,
    limit: number,
    offset: number
  ): Promise<SaleOffer[]> {
    if (!Number.isInteger(limit) || limit < 0)
      throw new Error('limit must be a nonnegative integer.')
    if (!Number.isInteger(offset) || offset < 0)
      throw new Error('offset must be a nonnegative integer.')
    return await FlowService.executeScript({
      script: scripts.getSaleOffers(this.devAddress),
      args: [
        fcl.arg(address, cdcTypes.Address),
        fcl.arg(limit, cdcTypes.Int),
        fcl.arg(offset, cdcTypes.Int),
      ],
    })
  }

  async getSaleOffer(
    address: string,
    saleOfferResourceID: number
  ): Promise<SaleOffer> {
    if (!Number.isInteger(saleOfferResourceID))
      throw new Error('saleOfferResourceID must be an integer.')
    return await FlowService.executeScript({
      script: scripts.getSaleOffer(this.devAddress),
      args: [
        fcl.arg(address, cdcTypes.Address),
        fcl.arg(saleOfferResourceID, cdcTypes.UInt64),
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
