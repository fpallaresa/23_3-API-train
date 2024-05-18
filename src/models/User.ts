import { Entity, PrimaryGeneratedColumn, Column, BeforeInsert, BeforeUpdate, OneToMany } from "typeorm";
import bcrypt from "bcrypt";
import { isEmail, isLength } from "validator";
import { Ticket } from "./Ticket";

export enum Treatment {
  SR = "SR.",
  SRA = "SRA.",
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({ unique: true })
  nationalityId: string;

  @Column()
  nationality: string;

  @Column()
  birthDate: Date;

  @Column({
    type: "enum",
    enum: Treatment,
  })
  treatment: Treatment;

  @BeforeInsert()
  @BeforeUpdate()
  async validate() {
    if (!isEmail(this.email)) {
      throw new Error("Invalid email address");
    }
    if (!isLength(this.password, { min: 8 })) {
      throw new Error("Password must be at least 8 characters long");
    }
  }
  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password) {
      this.password = await bcrypt.hash(this.password, 10);
    }
  }

  @OneToMany(() => Ticket, (ticket) => ticket.user)
  tickets: Ticket[];
}
