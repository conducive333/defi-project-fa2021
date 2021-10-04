import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { FlowTransaction } from './FlowTransaction.entity'

@Entity()
export class SaleOfferCompletedEvent {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date

  @Column({ name: 'sale_offer_resource_id', type: 'text', nullable: false })
  saleOfferResourceId: string

  @Column({ name: 'storefront_resource_id', type: 'text', nullable: false })
  storefrontResourceId: string

  @Column({ name: 'accepted', type: 'boolean', nullable: false })
  accepted: boolean

  @ManyToOne(
    () => FlowTransaction,
    (flowTransaction) => flowTransaction.saleOfferCompletedEvents,
    {
      nullable: false,
    }
  )
  @JoinColumn({ name: 'flow_transaction_id' })
  flowTransaction: FlowTransaction

  @Column({ name: 'flow_transaction_id', type: 'text', nullable: false })
  flowTransactionId: string
}
