import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm'

export enum FileType {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}

@Entity()
export class CryptoCreateFile {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
    nullable: false,
  })
  createdAt: Date

  @Column({ type: 'text', nullable: false, unique: true })
  key: string

  @Column({ type: 'text', nullable: false })
  name: string

  @Column({ type: 'text', nullable: false })
  url: string

  @Column({ type: 'text', nullable: false })
  mimetype: string

  @Column({ type: 'enum', enum: FileType, nullable: false })
  filetype: FileType

  @Column({ type: 'integer', nullable: false })
  size: number
}
