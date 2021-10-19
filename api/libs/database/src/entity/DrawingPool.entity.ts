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
import { CryptoCreateFile } from './CryptoCreateFile.entity'
import { NftSubmission } from './NftSubmission.entity'
import { UserToDrawingPool } from './UserToDrawingPool.entity'

@Entity()
@Check(`"max_size" >= 0`)
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

  @OneToOne(() => CryptoCreateFile, (cryptoCreateFile) => cryptoCreateFile.id, { nullable: false })
  @JoinColumn({ name: 'file_id' })
  file: CryptoCreateFile

  @Column({ name: 'file_id', type: 'uuid', nullable: false })
  fileId: string

  @Column({ name: 'release_date', type: 'timestamptz', nullable: false })
  releaseDate: Date

  @Column({ name: 'end_date', type: 'timestamptz', nullable: false })
  endDate: Date

  @Column({ name: 'max_size', type: 'integer', nullable: false })
  maxSize: number

  @OneToMany(() => NftSubmission, (nftSubmission) => nftSubmission.creator)
  submissions: NftSubmission[]

  @OneToMany(
    () => UserToDrawingPool,
    (userToDrawingPool) => userToDrawingPool.drawingPool
  )
  userToDrawingPools: UserToDrawingPool[]
}
