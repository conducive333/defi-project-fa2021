import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { SaleOfferCompletedEvent } from './SaleOfferCompletedEvent.entity'
import { FlowTransaction } from './FlowTransaction.entity'
import { MarketItem } from './MarketItem.entity'

@Entity()
export class SaleOfferAvailableEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date

  @Column({ name: 'storefront_address', type: 'text', nullable: false })
  storefrontAddress: string

  @Column({ name: 'sale_offer_resource_id', type: 'text', nullable: false })
  saleOfferResourceId: string

  @Column({ name: 'nft_type', type: 'text', nullable: false })
  nftType: string

  @ManyToOne(
    () => MarketItem,
    (marketItem) => marketItem.saleOfferAvailableEvent,
    {
      nullable: false,
    }
  )
  @JoinColumn({ name: 'market_item_id' })
  marketItem: MarketItem

  @Column({ name: 'market_item_id', type: 'uuid', nullable: false })
  marketItemId: string

  @Column({ name: 'ft_vault_type', type: 'text', nullable: false })
  ftVaultType: string

  @Column({ type: 'text', nullable: false })
  price: string

  @ManyToOne(
    () => FlowTransaction,
    (flowTransaction) => flowTransaction.saleOfferAvailableEvents,
    {
      nullable: false,
    }
  )
  @JoinColumn({ name: 'flow_transaction_id' })
  flowTransaction: FlowTransaction

  @Column({ name: 'flow_transaction_id', type: 'text', nullable: false })
  flowTransactionId: string

  @OneToOne(() => SaleOfferCompletedEvent, {
    nullable: true,
  })
  @JoinColumn({ name: 'sale_offer_completed_event_id' })
  saleOfferCompletedEvent: SaleOfferCompletedEvent

  @Column({
    name: 'sale_offer_completed_event_id',
    type: 'uuid',
    nullable: true,
  })
  saleOfferCompletedEventId: string
}
