import { Column, Entity, PrimaryColumn } from 'typeorm'
import { SessionEntity } from 'typeorm-store'
@Entity()
export class UserSession implements SessionEntity {
  @PrimaryColumn()
  id: string

  @Column({ name: 'expires_at' })
  expiresAt: number

  @Column()
  data: string
}
