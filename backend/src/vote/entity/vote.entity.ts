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
import { Question } from "../../question/entity/question.entity";
import { Answer } from "../../answer/entity/answer.entity";
import { VoteType } from "../../enums/vote-type.enum";

@Entity()
export class Vote {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: VoteType, name: "vote_type" })
  voteType: VoteType;

  @ManyToOne(() => User, (user) => user.votes)
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Question, (question) => question.votes, { nullable: true })
  @JoinColumn({ name: "question_id" })
  question: Question;

  @ManyToOne(() => Answer, (answer) => answer.votes, { nullable: true })
  @JoinColumn({ name: "answer_id" })
  answer: Answer;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;
}
