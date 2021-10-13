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
export class CryptoCreateItem {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    nullable: false,
  })
  createdAt: Date

  @Column({ type: 'text', nullable: false })
  name: string

  @Column({ type: 'text', nullable: false })
  description: string

  @Column({ type: 'text', nullable: false })
  image: string

  @OneToMany(() => NftEvent, (event) => event.cryptoCreateItem)
  events: NftEvent[]

  @OneToMany(() => SaleOfferAvailableEvent, (event) => event.cryptoCreateItem)
  saleOfferAvailableEvent: SaleOfferAvailableEvent[]
}
