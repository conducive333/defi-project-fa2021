import { BaseEventListener } from '@api/flow/flow-events'
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import { FlowService, FlowTypes } from '@api/flow/flow-service'
import { FlowTransaction, NftEvent, NftEventType } from '@api/database'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { FlowTransactionService } from '../transaction/transaction.service'
import { EntityManager, getConnection } from 'typeorm'
import { DepositFields, MintedFields, WithdrawFields } from './nft.events'

@Injectable()
export class NFTListener extends BaseEventListener {
  private readonly formattedEvents: Record<string, NftEventType> = {}
  private readonly FLOW_TOKEN_WITHDRAW: string
  private readonly FLOW_TOKEN_DEPOSIT: string
  private readonly FLOW_FEES_DEPOSIT: string
  private static readonly contract = 'DooverseItems'
  private static readonly cache = new Set<string>()
  private static readonly events = [
    NftEventType.withdraw,
    NftEventType.deposit,
    NftEventType.minted,
  ]

  constructor(
    private readonly flowTransactionService: FlowTransactionService,
    private readonly configService: ConfigService
  ) {
    super(
      configService.get<string>('FLOW_DEV_ADDRESS'),
      NFTListener.contract,
      NFTListener.events
    )
    this.FLOW_TOKEN_WITHDRAW = FlowService.formatEvent(
      this.configService.get<string>('FLOW_TOKEN_ADDRESS'),
      'FlowToken',
      'TokensWithdrawn'
    )
    this.FLOW_TOKEN_DEPOSIT = FlowService.formatEvent(
      this.configService.get<string>('FLOW_TOKEN_ADDRESS'),
      'FlowToken',
      'TokensDeposited'
    )
    this.FLOW_FEES_DEPOSIT = FlowService.formatEvent(
      this.configService.get<string>('FLOW_FEES_ADDRESS'),
      'FlowFees',
      'TokensDeposited'
    )
    NFTListener.events.forEach((ev) => {
      this.formattedEvents[this.formatEvent(ev)] = ev
    })
  }

  async processTransaction(
    txInfo: FlowTransaction,
    events: FlowTypes.TransactionEvent[]
  ): Promise<void> {
    await getConnection().transaction(async (tx) => {
      await tx.query(`SELECT pg_advisory_xact_lock($1)`, [
        FlowTransactionService.LOCK_ID,
      ])
      const exists = await this.flowTransactionService.findOne(tx, txInfo.id)
      if (!exists) {
        const parsedEvents: QueryDeepPartialEntity<NftEvent>[] = []
        events.forEach((ev) => {
          if (
            this.formattedEvents[ev.type] === NftEventType.withdraw ||
            this.formattedEvents[ev.type] === NftEventType.deposit
          ) {
            const fields = ev.payload.value.fields as
              | WithdrawFields
              | DepositFields
            parsedEvents.push({
              eventType: this.formattedEvents[ev.type],
              eventIndex: ev.eventIndex,
              nftId: fields[0]?.value?.value,
              address: fields[1]?.value?.value?.value,
              flowTransactionId: txInfo.id,
            })
          } else if (this.formattedEvents[ev.type] === NftEventType.minted) {
            const fields = ev.payload.value.fields as MintedFields
            parsedEvents.push({
              eventType: this.formattedEvents[ev.type],
              eventIndex: ev.eventIndex,
              nftId: fields[0]?.value?.value,
              flowTransactionId: txInfo.id,
              marketItemId: this.getMarketItemId(fields),
            })
          }
        })
        await this.flowTransactionService.create(tx, txInfo)
        await this.insertNftEvents(tx, parsedEvents)
      }
    })
  }

  private getMarketItemId(fields: MintedFields) {
    const initMeta = fields[1]?.value?.value
    for (const meta of initMeta) {
      if (meta?.key?.value === 'marketItemId') {
        return meta?.value?.value
      }
    }
  }

  private async insertNftEvents(
    tx: EntityManager,
    events: QueryDeepPartialEntity<NftEvent>[]
  ) {
    if (events.length === 0) return []
    await tx.insert(NftEvent, events)
  }
}
