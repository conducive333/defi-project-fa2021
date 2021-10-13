import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm'
import { DrawingPool } from './DrawingPool.entity'
import { NftSubmission } from './NftSubmission.entity'

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

  @Column({ name: 'drawing_pool_id', type: 'uuid', nullable: true })
  drawingPoolId: string

  @ManyToOne(() => DrawingPool, (drawingPool) => drawingPool.users, {
    nullable: true,
  })
  drawingPool: DrawingPool
}
