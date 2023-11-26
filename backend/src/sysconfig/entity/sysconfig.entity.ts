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

@Entity()
export class Sysconfig {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ name: "create_question" })
  createQuestion: number;

  @Column({ name: "update_question" })
  updateQuestion: number;

  @Column({ name: "create_answer" })
  createAnswer: number;

  @Column({ name: "update_answer" })
  updateAnswer: number;

  @Column({ name: "create_comment" })
  createComment: number;

  @Column({ name: "update_comment" })
  updateComment: number;

  @Column({ name: "up_vote" })
  upVote: number;

  @Column({ name: "cancle_up_vote" })
  cancleUpVote: number;

  @Column({ name: "change_down_vote_to_up_vote" })
  changeDownVoteToUpVote: number;

  @Column({ name: "accept_answer" })
  acceptAnswer: number;

  @Column({ name: "delete_question" })
  deleteQuestion: number;

  @Column({ name: "delete_answer" })
  deleteAnswer: number;

  @Column({ name: "delete_comment" })
  deleteComment: number;

  @Column({ name: "down_vote" })
  downVote: number;

  @Column({ name: "cancle_down_vote" })
  cancleDownVote: number;

  @Column({ name: "change_up_vote_to_down_vote" })
  changeUpVoteToDownVote: number;

  @Column({ name: "un_accept_answer" })
  unAcceptAnswer: number;

  @Column({ name: "block_question" })
  blockQuestion: number;

  @Column({ name: "verify_question" })
  verifyQuestion: number;

  @Column({ name: "verify_tag" })
  verifyTag: number;

  @Column({ name: "is_use" })
  isUse: boolean;

  @CreateDateColumn({ name: "created_at" })
  createdAt: Date;

  @UpdateDateColumn({ name: "updated_at" })
  updatedAt: Date;

  // This is the foreign key column for the relationship entities.

  @ManyToOne(() => User, (user) => user.sysconfigs)
  @JoinColumn({ name: "latest_edit_user_id" })
  latestEditUser: User;
}
