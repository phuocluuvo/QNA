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
import { Collection } from "../../collection/enity/collection.entity";
import { Announcement } from "../../announcement/entity/announcement.entity";
import { Sysconfig } from "../../sysconfig/entity/sysconfig.entity";

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

  @Column({ nullable: true, unique: true })
  email: string;

  @Column({ nullable: true })
  title: string;

  //Social links
  @Column({ nullable: true, name: "facebook_link" })
  facebookLink: string;

  @Column({ nullable: true, name: "github_link" })
  githubLink: string;

  @Column({ nullable: true, name: "linkedin_link" })
  twitterLink: string;

  @Column({ nullable: true, name: "website_link" })
  websiteLink: string;
  //

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
    default: UserState.VERIFYING,
  })
  state: UserState;

  @Column({ type: "varchar", length: 255, nullable: true })
  uuid: string;

  @Column({ name: "uuid_created_at", type: "datetime", nullable: true })
  uuid_created_at: Date;

  @Column({ nullable: true, type: "text" })
  about: string;

  @Column({ nullable: true, type: "text" })
  location: string;

  @Column({ nullable: true })
  more: string;

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

  @OneToMany(() => Collection, (co) => co.user)
  collections: Collection[];

  @OneToMany(() => History, (history) => history.user)
  histories: History[];

  @OneToMany(() => Announcement, (a) => a.user)
  announcements: Announcement[];

  @OneToMany(() => Sysconfig, (a) => a.latestEditUser)
  sysconfigs: Sysconfig[];
}
