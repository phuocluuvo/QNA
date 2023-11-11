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
  id: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  //  This is the foreign key column for the relationship entities.

  @ManyToOne(() => User, (user) => user.questions, { onDelete: "CASCADE" })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Activity, (activity) => activity.notifications, {
    nullable: true,
  })
  @JoinColumn({ name: "activity_id" })
  activity: Activity;
}
