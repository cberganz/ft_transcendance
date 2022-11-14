import { Column, Entity, OneToOne, OneToMany, ManyToMany, TableInheritance, JoinTable, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/database/user.entity'

@Entity()
export class Channels {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToMany(() => User)
  @JoinTable()
  members: User[];

  @Column()
  type: string;

  @Column()
  password: string;

  @ManyToMany(() => User)
  @JoinTable()
  admin: User[];

  @ManyToMany(() => User)
  @JoinTable()
  blacklist: User[];
}
