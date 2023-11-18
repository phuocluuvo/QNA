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
import { Activity } from "../../activity/entity/activity.entity";

@Entity()
export class Notification {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  title: string;

  @Column({ type: "text" })
  description: string;

  @Column({ name: "is_read", default: false })
  isRead: boolean;

  @Column({ name: "is_announcement", default: false })
  isAnnouncement: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  //  This is the foreign key column for the relationship entities.

  @ManyToOne(() => User, (user) => user.questions, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Activity, (activity) => activity.notifications, {
    nullable: true,
  })
  @JoinColumn({ name: "activity_id" })
  activity: Activity;
}
