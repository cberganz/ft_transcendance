import { Column, Entity, OneToOne, OneToMany, ManyToOne, JoinTable, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/database/user.entity'
import { Channels } from 'src/database/channels.entity'

@Entity()
export class Messages {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Channels)
  @JoinTable()
  channel: Channels;

  @ManyToOne(() => User)
  @JoinTable()
  author: User;

  @Column()
  date: Date;

  @Column()
  content: string;
}
