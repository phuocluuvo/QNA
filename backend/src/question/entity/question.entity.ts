import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class Question {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column({ length: 300 })
  title: string;

  @Column("text")
  content: string;

  @Column()
  views: number;

  @Column()
  vote: number;
}
