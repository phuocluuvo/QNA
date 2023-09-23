import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

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
  vote: number;
}
