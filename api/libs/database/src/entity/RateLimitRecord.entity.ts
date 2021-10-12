import { Column, Entity, PrimaryColumn } from 'typeorm'

@Entity()
export class RateLimitRecord {
  @PrimaryColumn({ type: 'varchar', length: 255 })
  key: string

  @Column({ type: 'integer', nullable: false, default: 0 })
  points: number

  @Column({ type: 'bigint' })
  expire: string
}
