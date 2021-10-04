import { BaseEventListener } from '@api/flow/flow-events'
import { Injectable } from '@nestjs/common'
import { Storefront } from './storefront.constants'
import { FlowTypes } from '@api/flow/flow-service'
import { EntityManager, getConnection, IsNull, Not } from 'typeorm'
import {
  FlowTransaction,
  MintedCardEvent,
  SaleOfferAvailableEvent,
  SaleOfferCompletedEvent,
} from '@api/database'
import {
  SaleOfferAvailableFields,
  SaleOfferCompletedFields,
} from './storefront.events'
import { FlowTransactionService } from '../transaction/transaction.service'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class StorefrontListener extends BaseEventListener {
  private readonly formattedEvents: Record<string, Storefront> = {}
  private static readonly events = [
    Storefront.saleOfferAvailable,
    Storefront.saleOfferCompleted,
  ]

  constructor(
    private readonly flowTransactionService: FlowTransactionService,
    configService: ConfigService
  ) {
    super(
      configService.get<string>('FLOW_DEV_ADDRESS'),
      Storefront.contract,
      StorefrontListener.events
    )
    StorefrontListener.events.forEach((ev) => {
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
        const soaEvents: SaleOfferAvailableEvent[] = []
        const socEvents: SaleOfferCompletedEvent[] = []
        await Promise.all(
          events.map(async (ev) => {
            if (
              this.formattedEvents[ev.type] === Storefront.saleOfferAvailable
            ) {
              const fields = ev.payload.value.fields as SaleOfferAvailableFields
              const parsedSaleOffer = await this.parseSaleOfferAvailable(
                tx,
                fields
              )
              parsedSaleOffer.flowTransactionId = txInfo.id
              soaEvents.push(parsedSaleOffer)
            } else if (
              this.formattedEvents[ev.type] === Storefront.saleOfferCompleted
            ) {
              const fields = ev.payload.value.fields as SaleOfferCompletedFields
              const parsedSaleOffer = this.parseSaleOfferCompleted(fields)
              parsedSaleOffer.flowTransactionId = txInfo.id
              socEvents.push(parsedSaleOffer)
            }
          })
        )
        await this.flowTransactionService.create(tx, txInfo)
        soaEvents.length !== 0 &&
          (await tx.insert(SaleOfferAvailableEvent, soaEvents))
        socEvents.length !== 0 &&
          (await tx.insert(SaleOfferCompletedEvent, socEvents))
      }
    })
  }

  private parseSaleOfferCompleted(fields: SaleOfferCompletedFields) {
    const saleOfferCompletedEvent = new SaleOfferCompletedEvent()
    for (const field of fields) {
      if (field.name === 'saleOfferResourceID') {
        saleOfferCompletedEvent.saleOfferResourceId = field?.value?.value
      } else if (field.name === 'storefrontResourceID') {
        saleOfferCompletedEvent.storefrontResourceId = field?.value?.value
      } else if (field.name === 'accepted') {
        saleOfferCompletedEvent.accepted = field?.value?.value
      }
    }
    return saleOfferCompletedEvent
  }

  private async parseSaleOfferAvailable(
    tx: EntityManager,
    fields: SaleOfferAvailableFields
  ) {
    const saleOfferAvailableEvent = new SaleOfferAvailableEvent()
    for (const field of fields) {
      if (field.name === 'storefrontAddress') {
        saleOfferAvailableEvent.storefrontAddress = field?.value?.value
      } else if (field.name === 'saleOfferResourceID') {
        saleOfferAvailableEvent.saleOfferResourceId = field?.value?.value
      } else if (field.name === 'nftType') {
        saleOfferAvailableEvent.nftType = field?.value?.value?.staticType
      } else if (field.name === 'nftID') {
        const mintedCard = await this.nftIdToMintedCard(tx, field?.value?.value)
        saleOfferAvailableEvent.mintedCardId = mintedCard.id
      } else if (field.name === 'ftVaultType') {
        saleOfferAvailableEvent.ftVaultType = field?.value?.value?.staticType
      } else if (field.name === 'price') {
        saleOfferAvailableEvent.price = field?.value?.value
      }
    }
    return saleOfferAvailableEvent
  }

  private async nftIdToMintedCard(tx: EntityManager, nftId: string) {
    return await tx.findOne(MintedCardEvent, {
      where: {
        nftId: nftId,
        mintedCardId: Not(IsNull()),
      },
    })
  }
}
