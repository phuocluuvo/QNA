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
import { Question } from "../../question/entity/question.entity";
import { Answer } from "../../answer/entity/answer.entity";
import { VoteType } from "../../enums/vote-type.enum";
import { Activity } from "../../activity/entity/activity.entity";

@Entity()
export class Vote {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: VoteType, name: "vote_type" })
  voteType: VoteType;

  @ManyToOne(() => User, (user) => user.votes, { nullable: false })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToOne(() => Question, (question) => question.votes, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "question_id" })
  question: Question;

  @ManyToOne(() => Answer, (answer) => answer.votes, {
    nullable: true,
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "answer_id" })
  answer: Answer;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @OneToMany(() => Activity, (activity) => activity.comment)
  activity: Activity[];
}
