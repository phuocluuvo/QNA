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
import { Comment } from "../../comment/entity/comment.entity";

@Entity()
export class History {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: ObjectActivityTypeEnum, nullable: true })
  type: ObjectActivityTypeEnum;

  @Column({ length: 300, nullable: true, default: null })
  title: string;

  @Column("text")
  content: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // Relation

  @ManyToOne(() => Answer, (answer) => answer.histories, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "answer_id" })
  answer: Answer;

  @ManyToOne(() => Question, (question) => question.histories, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "question_id" })
  question: Question;

  @ManyToOne(() => Comment, (cmt) => cmt.histories, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "comment_id" })
  comment: Comment;

  @ManyToOne(() => User, (user) => user.histories, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;
}
