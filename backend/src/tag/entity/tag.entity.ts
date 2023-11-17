import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VirtualColumn,
} from "typeorm";
import { Question } from "../../question/entity/question.entity";
import { TagState } from "../../enums/tag-state.enum";
import { User } from "../../users/entity/users.entity";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column("text")
  content: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ type: "enum", enum: TagState, default: TagState.PENDING })
  state: TagState;

  @VirtualColumn({
    query: (alias) =>
      `SELECT COUNT(*)
             FROM question_tag
             WHERE question_tag.tag_id = ${alias}.id`,
  })
  questionsNumber: number;

  // This is the foreign key column for the relationship entities.

  @ManyToOne(() => User, (user) => user.questions, { nullable: true })
  @JoinColumn({ name: "user_id" })
  user: User;

  @ManyToMany(() => Question, (question) => question.tags)
  questions: Question[];
}
