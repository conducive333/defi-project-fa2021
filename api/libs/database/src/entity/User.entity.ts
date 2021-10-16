import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
} from 'typeorm'
import { NftSubmission } from './NftSubmission.entity'
import { UserToDrawingPool } from './UserToDrawingPool.entity'

@Entity()
export class User {
  @PrimaryColumn('text')
  id: string

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date

  @Column({ type: 'text', nullable: false, unique: true })
  email: string

  @Column({ type: 'text', nullable: false, unique: true })
  username: string

  @OneToMany(() => NftSubmission, (nftSubmission) => nftSubmission.creator)
  submissions: NftSubmission

  @OneToMany(
    () => UserToDrawingPool,
    (userToDrawingPool) => userToDrawingPool.user
  )
  userToDrawingPools: UserToDrawingPool[]
}
