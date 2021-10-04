import { SaleOfferAvailableEvent } from './SaleOfferAvailableEvent.entity'
import { NftEvent } from './NftEvent.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'

@Entity()
export class MarketItem {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date

  @Column({ type: 'text', nullable: false })
  name: string

  @Column({ type: 'text', nullable: false })
  description: string

  @Column({ type: 'text', nullable: false })
  image: string

  @OneToMany(() => NftEvent, (event) => event.marketItem)
  events: NftEvent[]

  @OneToMany(() => SaleOfferAvailableEvent, (event) => event.marketItem)
  saleOfferAvailableEvent: SaleOfferAvailableEvent[]
}
