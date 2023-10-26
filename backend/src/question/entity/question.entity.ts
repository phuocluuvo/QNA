import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "../../users/entity/users.entity";
import { Answer } from "../../answer/entity/answer.entity";
import { Vote } from "../../vote/entity/vote.entity";
import { Tag } from "../../tag/entity/tag.entity";

@Entity()
export class Question {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ length: 300 })
  title: string;

  @Column("text")
  content: string;

  @Column({ default: 0 })
  views: number;

  @Column({ default: 0 })
  votes: number;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // This is the foreign key column for the relationship entities.

  @ManyToOne(() => User, (user) => user.questions)
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];

  @OneToMany(() => Vote, (vote) => vote.question)
  vote: Vote[];

  @ManyToMany(() => Tag, (tag) => tag.questions)
  @JoinTable({
    name: "question_tag",
    joinColumn: {
      name: "question_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "tag_id",
      referencedColumnName: "id",
    },
  })
  tags: Tag[];
}
