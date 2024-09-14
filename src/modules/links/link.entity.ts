import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from '../users/users.entity';

@Entity()
export class Link {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  real_link: string;

  @Column({ unique: true })
  short_link: string;

  @Column()
  expiration_date: Date;

  @ManyToOne(() => User, (user) => user.links, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @DeleteDateColumn()
  deleted_date?: Date;

  @CreateDateColumn()
  created_date?: Date;

  @UpdateDateColumn()
  updated_date?: Date;
}
