import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class BlockCursor {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column({ name: 'event_name', type: 'text', nullable: false, unique: true })
  eventName: string

  @Column({ name: 'current_block_height', type: 'bigint', nullable: false })
  currentBlockHeight: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date
}
