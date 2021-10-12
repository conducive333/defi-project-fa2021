import { Column, CreateDateColumn, Entity, PrimaryColumn } from 'typeorm'

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
}
