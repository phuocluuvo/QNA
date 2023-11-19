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
import { Answer } from "../../answer/entity/answer.entity";
import { Activity } from "../../activity/entity/activity.entity";
import { Question } from "../../question/entity/question.entity";
import { CommentTypeEnum } from "../../enums/comment-type.enum";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column("text")
  content: string;

  @Column({
    type: "enum",
    enum: CommentTypeEnum,
    default: CommentTypeEnum.NORMAL,
  })
  type: CommentTypeEnum;

  // Relationship

  @ManyToOne(() => Answer, (answer) => answer.comments, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "answer_id" })
  answer: Answer;

  @ManyToOne(() => Question, (question) => question.answers, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "question_id" })
  question: Question;

  @ManyToOne(() => User, (user) => user.answers, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @OneToMany(() => Activity, (activity) => activity.comment)
  activity: Activity[];
}
