import {
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm'
import { DrawingPool } from './DrawingPool.entity'
import { User } from './User.entity'

@Entity()
@Unique(['drawingPool', 'user']) // User can only join a drawing pool once
export class UserToDrawingPool {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @ManyToOne(
    () => DrawingPool,
    (drawingPool) => drawingPool.userToDrawingPools,
    { nullable: false }
  )
  drawingPool: DrawingPool

  @Column({ name: 'drawing_pool_id', type: 'uuid', nullable: false })
  drawingPoolId: string

  @ManyToOne(() => User, (user) => user.userToDrawingPools, { nullable: false })
  user: User

  @Column({ name: 'user_id', type: 'uuid', nullable: false })
  userId: string
}
