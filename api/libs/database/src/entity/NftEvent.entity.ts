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
import { OpenSpaceItem } from './OpenSpaceItem.entity'

export enum NftEventType {
  minted = 'Minted',
  deposit = 'Deposit',
  withdraw = 'Withdraw',
}

@Entity()
@Unique(['openSpaceItem'])
@Unique(['openSpaceItemId', 'nftId'])
export class NftEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    nullable: false,
  })
  createdAt: Date

  @Column({
    name: 'event_type',
    type: 'enum',
    enum: NftEventType,
    nullable: false,
  })
  eventType: NftEventType

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

  @ManyToOne(() => OpenSpaceItem, (openSpaceItem) => openSpaceItem.events, {
    nullable: false,
  })
  @JoinColumn({ name: 'open_space_item_id' })
  openSpaceItem: OpenSpaceItem

  @Column({ name: 'open_space_item_id', type: 'uuid', nullable: true })
  openSpaceItemId: string
}
