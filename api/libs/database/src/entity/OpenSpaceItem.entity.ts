import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm'
import { NftSubmission } from '../entity/NftSubmission.entity'

@Entity()
export class OpenSpaceItem {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    nullable: false,
  })
  createdAt: Date

  @OneToOne(() => NftSubmission, (nftSubmission) => nftSubmission.id, {
    nullable: false,
  })
  @JoinColumn({ name: 'nft_submission_id' })
  nftSubmission: NftSubmission

  @Column({ name: 'nft_submission_id', type: 'uuid', nullable: false })
  nftSubmissionId: string
}
