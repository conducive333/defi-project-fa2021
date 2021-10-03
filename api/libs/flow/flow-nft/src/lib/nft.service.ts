import { FlowAuthService } from '@doosan/flow/flow-auth'
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import { FlowTypes, FlowService } from '@doosan/flow/flow-service'
import { NftMetadata, NftType } from './nft.types'
import * as transactions from './transactions'
import * as cdcTypes from '@onflow/types'
import * as scripts from './scripts'
import * as fcl from '@onflow/fcl'

@Injectable()
export class NftService {
  protected readonly devAddress: string
  protected readonly nftAddress: string

  constructor(
    private readonly flowAuthorizer: FlowAuthService,
    private readonly configService: ConfigService
  ) {
    this.devAddress = this.configService.get<string>('FLOW_DEV_ADDRESS')
    this.nftAddress = this.configService.get<string>('FLOW_NFT_ADDRESS')
  }

  async mint(
    index: number,
    recipient: string,
    initMetas: NftMetadata[]
  ): Promise<FlowTypes.TransactionStatus> {
    const devAuth = this.flowAuthorizer.developerAuthenticate(index)
    const trsAuth = this.flowAuthorizer.treasuryAuthenticate()
    const cadenceCode = transactions.mint(this.devAddress, this.nftAddress)
    const [inits, initTypes] = FlowService.convertObjects(initMetas)
    const transaction = await FlowService.sendTx({
      transaction: cadenceCode,
      args: [
        fcl.arg(fcl.withPrefix(recipient), cdcTypes.Address),
        fcl.arg(inits, initTypes),
      ],
      authorizations: [devAuth],
      payer: trsAuth,
      proposer: devAuth,
    })
    return transaction
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
        fcl.arg(limit, cdcTypes.Int),
        fcl.arg(offset, cdcTypes.Int),
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
