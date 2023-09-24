import { Entity, Column, PrimaryColumn } from "typeorm";

@Entity()
export class User {
  @PrimaryColumn({ type: "uuid" })
  id: string;

  @Column({ length: 500 })
  name: string;

  @Column("text")
  avatar: string;

  @Column({ unique: true })
  email: string;

  @Column()
  isVerify: boolean;
}
