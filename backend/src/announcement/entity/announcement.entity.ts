import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../users/entity/users.entity";

@Entity()
export class Announcement {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ type: "text" })
  description: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ type: "datetime" })
  expiration_date: Date;

  @Column({ type: "datetime", nullable: true })
  publication_date: Date;

  @Column({ type: "tinyint", default: 0 })
  is_published: boolean;

  @ManyToOne(() => User, (user) => user.announcements, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user: User;
}
