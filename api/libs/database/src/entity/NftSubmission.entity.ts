import { DrawingPool } from './DrawingPool.entity'
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { User } from './User.entity'

@Entity()
@Unique(['drawingPoolId', 'creatorId']) // User can only make one submission per drawing pool
@Check(`"address" ~ '^0x[a-z0-9]{16}$'`)
export class NftSubmission {
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

  @Column({ type: 'text', nullable: false })
  address: string

  @ManyToOne(() => DrawingPool, (drawingPool) => drawingPool.submissions)
  drawingPool: string

  @Column({ name: 'drawing_pool_id', type: 'uuid', nullable: false })
  drawingPoolId: string

  @ManyToOne(() => User, (user) => user.submissions)
  creator: string

  @Column({ name: 'creator_id', type: 'uuid', nullable: false })
  creatorId: string
}
