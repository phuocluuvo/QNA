import { Role } from "../../enums/role.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  VirtualColumn,
} from "typeorm";
import { Question } from "../../question/entity/question.entity";
import { Answer } from "../../answer/entity/answer.entity";
import { Vote } from "../../vote/entity/vote.entity";
import { Activity } from "../../activity/entity/activity.entity";
import { UserState } from "../../enums/user-state.enum";
import { Tag } from "../../tag/entity/tag.entity";
import { Bookmark } from "../../bookmark/entity/bookmark.entity";
import { History } from "../../history/entity/history.entity";

@Entity()
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  fullname: string;

  @Column({ type: "text", nullable: true, default: null })
  avatar: string;

  @Column({ nullable: true, default: null })
  dob: Date;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false, select: false })
  password: string;

  @Column({ type: "enum", enum: Role, default: Role.USER })
  role: Role;

  @Column({ name: "activity_point", nullable: false, default: 0 })
  activityPoint: number;

  @Column({ default: null, select: false })
  refreshToken: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  @Column({
    type: "enum",
    enum: UserState,
    default: UserState.ACTIVE,
  })
  state: UserState;

  // This is the virtual column.

  @VirtualColumn({
    query: (alias) =>
      `SELECT COUNT(*)
             FROM notification
             WHERE notification.user_id = ${alias}.id
               AND notification.is_read = false`,
  })
  notificationsNumber: number;

  // This is the foreign key column for the relationship entities.

  @OneToMany(() => Question, (question) => question.user)
  questions: Question[];

  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @OneToMany(() => Activity, (re) => re.user)
  activities: Activity[];

  @OneToMany(() => Tag, (tag) => tag.user)
  tags: Tag[];

  @OneToMany(() => Bookmark, (bk) => bk.user)
  bookmarks: Bookmark[];

  @OneToMany(() => History, (history) => history.user)
  histories: History[];
}
