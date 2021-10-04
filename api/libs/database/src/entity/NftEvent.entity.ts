import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { FlowTransaction } from './FlowTransaction.entity'
import { MarketItem } from './MarketItem.entity'

export enum NftEventType {
  minted = 'Minted',
  deposit = 'Deposit',
  withdraw = 'Withdraw',
}

@Entity()
@Unique(['marketItem'])
@Unique(['marketItem', 'nftId'])
export class NftEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date

  @Column({ name: 'event_type', enum: NftEventType, nullable: false })
  eventType: string

  @Column({ name: 'event_index', type: 'integer', nullable: false })
  eventIndex: number

  @Column({ name: 'nft_id', type: 'text', nullable: false })
  nftId: string

  @Column({ type: 'text', nullable: true })
  address: string

  @ManyToOne(
    () => FlowTransaction,
    (flowTransaction) => flowTransaction.nftEvents,
    {
      nullable: false,
    }
  )
  @JoinColumn({ name: 'flow_transaction_id' })
  flowTransaction: FlowTransaction

  @Column({ name: 'flow_transaction_id', type: 'text', nullable: false })
  flowTransactionId: string

  @ManyToOne(() => MarketItem, (marketItem) => marketItem.events, {
    nullable: false,
  })
  @JoinColumn({ name: 'market_item_id' })
  marketItem: MarketItem

  @Column({ name: 'market_item_id', type: 'uuid', nullable: true })
  marketItemId: string
}
