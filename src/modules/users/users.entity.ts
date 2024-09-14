import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Link } from '../links/link.entity';

@Entity('test-user')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  reset_token: string;

  @Column({ nullable: true })
  avatar_url: string;

  @OneToMany(() => Link, (link) => link.user)
  links: Link[];

  @BeforeInsert()
  async hashPassword() {
    if (!this.password) {
      return;
    }
    this.password = await bcrypt.hash(this.password, 10);
  }

  async validatePassword(password: string): Promise<boolean> {
    if (!this.password) {
      return true;
    }
    return await bcrypt.compare(password, this.password);
  }
}
