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
import { Collection } from "../../collection/enity/collection.entity";

@Entity()
export class Bookmark {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "enum", enum: ObjectActivityTypeEnum, nullable: true })
  type: ObjectActivityTypeEnum;

  @ManyToOne(() => Answer, (answer) => answer.bookmarks, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "answer_id" })
  answer: Answer;

  @ManyToOne(() => Question, (question) => question.bookmarks, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "question_id" })
  question: Question;

  @ManyToOne(() => User, (user) => user.bookmarks, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "user_id" })
  user: User;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @ManyToOne(() => Collection, (co) => co.bookmarks, {
    onDelete: "CASCADE",
    nullable: true,
  })
  @JoinColumn({ name: "collection_id" })
  collection: Collection;
}
