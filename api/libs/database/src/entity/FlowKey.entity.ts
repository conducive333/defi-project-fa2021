import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class FlowKey {
  @PrimaryColumn({ type: 'integer' })
  id: number

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    nullable: false,
  })
  createdAt: Date

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
    nullable: false,
  })
  updatedAt: Date

  @Column({
    name: 'is_in_use',
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isInUse: boolean
}
