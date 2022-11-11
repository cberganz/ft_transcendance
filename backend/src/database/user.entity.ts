import { Column, Entity, OneToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  login: string;

  @Column({ unique: true, nullable: true, length: 8 })
  username: string;

  @Column('int', { array: true, default: [] })
  friends: number[];

  @Column('int', { array: true, default: [] })
  blacklist: number[];
}
