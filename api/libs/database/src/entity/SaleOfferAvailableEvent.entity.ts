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
import { OpenSpaceItem } from './OpenSpaceItem.entity'

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
    () => OpenSpaceItem,
    (openSpaceItem) => openSpaceItem.saleOfferAvailableEvent,
    {
      nullable: false,
    }
  )
  @JoinColumn({ name: 'open_space_item_id' })
  openSpaceItem: OpenSpaceItem

  @Column({ name: 'open_space_item_id', type: 'uuid', nullable: false })
  openSpaceItemId: string

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

  @OneToOne(
    () => SaleOfferCompletedEvent,
    (saleOfferCompletedEvent) => saleOfferCompletedEvent.id,
    {
      nullable: true,
    }
  )
  @JoinColumn({ name: 'sale_offer_completed_event_id' })
  saleOfferCompletedEvent: SaleOfferCompletedEvent

  @Column({
    name: 'sale_offer_completed_event_id',
    type: 'uuid',
    nullable: true,
  })
  saleOfferCompletedEventId: string
}
