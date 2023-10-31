import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VirtualColumn,
} from "typeorm";
import { Question } from "../../question/entity/question.entity";

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

  @VirtualColumn({
    query: (alias) =>
      `SELECT COUNT(*) FROM question_tag WHERE question_tag.tag_id = ${alias}.id`,
  })
  questionsNumber: number;

  // This is the foreign key column for the relationship entities.

  @ManyToMany(() => Question, (question) => question.tags)
  questions: Question[];
}
