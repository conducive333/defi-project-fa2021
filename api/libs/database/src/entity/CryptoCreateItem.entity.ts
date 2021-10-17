import { SaleOfferAvailableEvent } from './SaleOfferAvailableEvent.entity'
import { NftEvent } from './NftEvent.entity'
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { CryptoCreateFile } from './CryptoCreateFile.entity'

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

  @OneToOne(() => CryptoCreateFile, { nullable: false })
  @JoinColumn({ name: 'file_id' })
  file: CryptoCreateFile

  @Column({ name: 'file_id', type: 'uuid', nullable: false })
  fileId: string

  @OneToMany(() => NftEvent, (event) => event.cryptoCreateItem)
  events: NftEvent[]

  @OneToMany(() => SaleOfferAvailableEvent, (event) => event.cryptoCreateItem)
  saleOfferAvailableEvent: SaleOfferAvailableEvent[]
}
