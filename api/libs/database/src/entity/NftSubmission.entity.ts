import { DrawingPool } from './DrawingPool.entity'
import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  JoinColumn,
  ManyToOne,
  Column,
  Entity,
  Check,
} from 'typeorm'
import { User } from './User.entity'
import { UploadedFile } from './UploadedFile.entity'

@Entity()
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

  @ManyToOne(() => UploadedFile, (uploadedFile) => uploadedFile.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'file_id' })
  file: UploadedFile

  @Column({ name: 'file_id', type: 'uuid', nullable: false })
  fileId: string

  @Column({ type: 'text', nullable: false })
  address: string

  @ManyToOne(() => DrawingPool, (drawingPool) => drawingPool.submissions)
  @JoinColumn({ name: 'drawing_pool_id' })
  drawingPool: string

  @Column({ name: 'drawing_pool_id', type: 'uuid', nullable: false })
  drawingPoolId: string

  @ManyToOne(() => User, (user) => user.submissions)
  @JoinColumn({ name: 'creator_id' })
  creator: string

  @Column({ name: 'creator_id', type: 'text', nullable: false })
  creatorId: string
}
