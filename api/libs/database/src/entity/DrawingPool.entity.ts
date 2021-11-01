import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { UploadedFile } from './UploadedFile.entity'
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

  @OneToOne(() => UploadedFile, (uploadedFile) => uploadedFile.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'file_id' })
  file: UploadedFile

  @Column({ name: 'file_id', type: 'uuid', nullable: false })
  fileId: string

  @Column({ name: 'release_date', type: 'timestamptz', nullable: false })
  releaseDate: Date

  @Column({ name: 'end_date', type: 'timestamptz', nullable: false })
  endDate: Date

  @OneToMany(() => NftSubmission, (nftSubmission) => nftSubmission.creator)
  submissions: NftSubmission[]

  @OneToMany(
    () => UserToDrawingPool,
    (userToDrawingPool) => userToDrawingPool.drawingPool
  )
  userToDrawingPools: UserToDrawingPool[]
}
