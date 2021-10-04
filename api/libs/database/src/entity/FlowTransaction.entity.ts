import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm'
import { NftEvent } from './NftEvent.entity'
import { SaleOfferAvailableEvent } from './SaleOfferAvailableEvent.entity'
import { SaleOfferCompletedEvent } from './SaleOfferCompletedEvent.entity'

@Entity()
export class FlowTransaction {
  @PrimaryColumn({
    name: 'transaction_id',
    type: 'text',
  })
  id: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date

  @Column({ name: 'block_id', type: 'text', nullable: false })
  blockId: string

  @Column({ name: 'block_height', type: 'bigint', nullable: false })
  blockHeight: string

  @Column({ name: 'block_timestamp', type: 'timestamptz', nullable: false })
  blockTimestamp: Date

  @OneToMany(() => NftEvent, (event) => event.flowTransaction)
  nftEvents: NftEvent[]

  @OneToMany(() => SaleOfferAvailableEvent, (event) => event.flowTransaction)
  saleOfferAvailableEvents: SaleOfferAvailableEvent[]

  @OneToMany(() => SaleOfferCompletedEvent, (event) => event.flowTransaction)
  saleOfferCompletedEvents: SaleOfferCompletedEvent[]
}
