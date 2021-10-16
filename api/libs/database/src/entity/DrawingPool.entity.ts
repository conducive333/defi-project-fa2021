import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { NftSubmission } from './NftSubmission.entity'
import { UserToDrawingPool } from './UserToDrawingPool.entity'

@Entity()
export class DrawingPool {
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

  @Column({ name: 'release_date', type: 'timestamptz', nullable: false })
  releaseDate: Date

  @Column({ name: 'end_date', type: 'timestamptz', nullable: false })
  endDate: Date

  @Column({ type: 'integer', nullable: false })
  maxSize: number

  @OneToMany(() => NftSubmission, (nftSubmission) => nftSubmission.creator)
  submissions: NftSubmission[]

  @OneToMany(
    () => UserToDrawingPool,
    (userToDrawingPool) => userToDrawingPool.drawingPool
  )
  userToDrawingPools: UserToDrawingPool[]
}
