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
  VirtualColumn,
} from "typeorm";
import { User } from "../../users/entity/users.entity";
import { Answer } from "../../answer/entity/answer.entity";
import { Vote } from "../../vote/entity/vote.entity";
import { Tag } from "../../tag/entity/tag.entity";
import { QuestionTypeEnum } from "../../enums/question-type.enum";
import { Activity } from "../../activity/entity/activity.entity";
import { QuestionState } from "../../enums/question-state.enum";
import { Comment } from "../../comment/entity/comment.entity";
import { Bookmark } from "../../bookmark/entity/bookmark.entity";
import { History } from "../../history/entity/history.entity";

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

  @CreateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({ type: "enum", enum: QuestionState, default: QuestionState.PENDING })
  state: QuestionState;

  // This is the foreign key column for the relationship entities.

  @ManyToOne(() => User, (user) => user.questions)
  @JoinColumn({ name: "user_id" })
  user: User;

  @OneToMany(() => Answer, (answer) => answer.question)
  answers: Answer[];

  @OneToMany(() => Comment, (comment) => comment.question)
  comments: Comment[];

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

  @OneToMany(() => Activity, (activity) => activity.question)
  activity: Activity[];

  @OneToMany(() => Bookmark, (bk) => bk.question)
  bookmarks: Bookmark[];

  @OneToMany(() => History, (history) => history.question)
  histories: History[];

  // This is the virtual column for the relationship entities.

  @VirtualColumn({
    query: (alias) =>
      `SELECT COUNT(*)
             FROM answer
             WHERE answer.question_id = ${alias}.id`,
  })
  answersNumber: number;

  @VirtualColumn({
    query: (alias) =>
      `SELECT CASE
                        WHEN EXISTS (SELECT 1 FROM answer WHERE question_id = ${alias}.id) THEN
                            CASE
                                WHEN EXISTS (SELECT 1 FROM answer WHERE question_id = ${alias}.id AND is_approved = 1)
                                    THEN 'normal'
                                ELSE 'no_approved'
                                END
                        ELSE 'no_answer'
                        END AS result`,
  })
  type: QuestionTypeEnum;

  @VirtualColumn({
    query: (alias) =>
      `COALESCE(
        (SELECT JSON_ARRAYAGG(t.name)
         FROM tag AS t
         JOIN question_tag AS qt ON t.id = qt.tag_id
         WHERE qt.question_id = ${alias}.id),
        JSON_ARRAY()
      )`,
  })
  tagNames: string[];
}
