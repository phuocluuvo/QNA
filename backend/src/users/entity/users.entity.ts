import { Role } from "../../enums/role.enum";
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Question } from "../../question/entity/question.entity";
import { Answer } from "../../answer/entity/answer.entity";
import { Vote } from "../../vote/entity/vote.entity";
import { Reputation } from "../../reputation/entity/reputation.entity";

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

  @Column({ name: "reputation_point", nullable: false, default: 0 })
  reputationPoint: number;

  @Column({ default: null, select: false })
  refreshToken: string;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // This is the foreign key column for the relationship entities.

  @OneToMany(() => Question, (question) => question.user)
  questions: Question[];

  @OneToMany(() => Answer, (answer) => answer.user)
  answers: Answer[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes: Vote[];

  @OneToMany(() => Reputation, (re) => re.user)
  reputations: Reputation[];
}
