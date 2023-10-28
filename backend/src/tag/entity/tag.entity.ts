import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";
import { Question } from "../../question/entity/question.entity";

@Entity()
export class Tag {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false, unique: true })
  name: string;

  @Column("text")
  content: string;

  // This is the foreign key column for the relationship entities.

  @ManyToMany(() => Question, (question) => question.tags)
  questions: Question[];
}
