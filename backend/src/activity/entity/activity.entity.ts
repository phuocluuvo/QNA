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
export class Activity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "point_change" })
  pointChange: number;

  @Column({ name: "activity_type" })
  activityType: string;

  @Column({ name: "object_type" })
  objectType: string;

  @Column({ name: "object_id" })
  objectId: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // This is the foreign key column for the relationship entities.

  @ManyToOne(() => User, (user) => user.activities, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;
}
