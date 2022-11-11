import { Column, Entity, OneToOne, OneToMany, ManyToOne, JoinTable, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/database/user.entity'

@Entity()
export class Games {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User)
  @JoinTable()
  player1: User;

  @ManyToOne(() => User)
  @JoinTable()
  player2: User;

  @Column()
  player1_score: number;

  @Column()
  player2_score: number;

  @ManyToOne(() => User)
  @JoinTable()
  winner: User;

  @Column()
  start_time: Date;

}
