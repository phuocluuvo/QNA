import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../users/entity/users.entity";
import { Notification } from "../../notification/entity/notification.entity";
import { Question } from "../../question/entity/question.entity";
import { Answer } from "../../answer/entity/answer.entity";
import { Comment } from "../../comment/entity/comment.entity";
import { Vote } from "../../vote/entity/vote.entity";

@Entity()
export class Activity {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "point_change", default: 0 })
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

  @OneToMany(() => Notification, (notification) => notification.activity)
  notifications: Notification[];

  @ManyToOne(() => Question, (question) => question.activity, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "question_id" })
  question: Question;

  @ManyToOne(() => Answer, (answer) => answer.activity, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "answer_id" })
  answer: Answer;

  @ManyToOne(() => Comment, (comment) => comment.activity, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "comment_id" })
  comment: Comment;

  @ManyToOne(() => Vote, (vote) => vote.activity, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "vote_id" })
  vote: Vote;
}
