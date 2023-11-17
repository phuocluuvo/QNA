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
import { Answer } from "../../answer/entity/answer.entity";
import { Question } from "../../question/entity/question.entity";
import { ObjectActivityTypeEnum } from "../../enums/reputation.enum";

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: ObjectActivityTypeEnum, nullable: true })
  type: ObjectActivityTypeEnum;

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
}