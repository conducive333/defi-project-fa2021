import { BaseEventListener } from '@api/flow/flow-events'
import { ConfigService } from '@nestjs/config'
import { Injectable } from '@nestjs/common'
import { FlowService, FlowTypes } from '@api/flow/flow-service'
import {
  FlowTransaction,
  MintedCardEvent,
  MintedCardEventType,
  Notification,
} from '@api/database'
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity'
import { FlowTransactionService } from '../transaction/transaction.service'
import { EntityManager, getConnection } from 'typeorm'
import { DepositFields, MintedFields, WithdrawFields } from './nft.events'

@Injectable()
export class NFTListener extends BaseEventListener {
  private readonly formattedEvents: Record<string, MintedCardEventType> = {}
  private readonly FLOW_TOKEN_WITHDRAW: string
  private readonly FLOW_TOKEN_DEPOSIT: string
  private readonly FLOW_FEES_DEPOSIT: string
  private static readonly contract = 'DooverseItems'
  private static readonly cache = new Set<string>()
  private static readonly events = [
    MintedCardEventType.withdraw,
    MintedCardEventType.deposit,
    MintedCardEventType.minted,
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
        const parsedEvents: QueryDeepPartialEntity<MintedCardEvent>[] = []
        events.forEach((ev) => {
          if (
            this.formattedEvents[ev.type] === MintedCardEventType.withdraw ||
            this.formattedEvents[ev.type] === MintedCardEventType.deposit
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
          } else if (
            this.formattedEvents[ev.type] === MintedCardEventType.minted
          ) {
            const fields = ev.payload.value.fields as MintedFields
            parsedEvents.push({
              eventType: this.formattedEvents[ev.type],
              eventIndex: ev.eventIndex,
              nftId: fields[0]?.value?.value,
              flowTransactionId: txInfo.id,
              mintedCardId: this.getMintedCardId(fields),
            })
          }
        })
        await this.flowTransactionService.create(tx, txInfo)
        await this.insertMintedCardEvents(tx, parsedEvents)
        await this.sendNotifications(tx, events)
      }
    })
  }

  private getMintedCardId(fields: MintedFields) {
    const initMeta = fields[1]?.value?.value
    for (const meta of initMeta) {
      if (meta?.key?.value === 'mintedCardId') {
        return meta?.value?.value
      }
    }
  }

  private async insertMintedCardEvents(
    tx: EntityManager,
    events: QueryDeepPartialEntity<MintedCardEvent>[]
  ) {
    if (events.length === 0) return []
    await tx.insert(MintedCardEvent, events)
  }

  private async sendNotifications(
    tx: EntityManager,
    events: FlowTypes.TransactionEvent[]
  ) {
    if (events.length === 5) {
      if (
        this.formattedEvents[events[0].type] === MintedCardEventType.withdraw &&
        this.formattedEvents[events[1].type] === MintedCardEventType.deposit &&
        events[2].type === this.FLOW_TOKEN_WITHDRAW &&
        events[3].type === this.FLOW_TOKEN_DEPOSIT &&
        events[4].type === this.FLOW_FEES_DEPOSIT
      ) {
        const withdrawFields = events[0].payload.value.fields as WithdrawFields
        const depositFields = events[1].payload.value.fields as DepositFields
        const receiver = depositFields[1]?.value?.value?.value
        const sender = withdrawFields[1]?.value?.value?.value
        const nftId = withdrawFields[0]?.value?.value
        if (sender && receiver) {
          const mintEvent = await tx.findOne(MintedCardEvent, {
            where: {
              eventType: MintedCardEventType.minted,
              nftId: nftId,
            },
          })
          if (mintEvent) {
            const senderMsg = tx.create(Notification, {
              address: sender,
              mintedCardId: mintEvent.mintedCardId,
              content: `You sent a gift to ${receiver}`,
            })
            const receiverMsg = tx.create(Notification, {
              address: receiver,
              mintedCardId: mintEvent.mintedCardId,
              content: `You received a gift from ${sender}`,
            })
            return await tx.insert(Notification, [senderMsg, receiverMsg])
          }
        }
      }
    }
  }
}
