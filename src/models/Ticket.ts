import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Journey } from './Journey';
import { User } from './User';

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  locator: string;

  @Column()
  isPaid: boolean;

  @Column()
  seatType: string; // VIP, Business, Normal

  @ManyToOne(() => Journey, (journey) => journey.tickets)
  journey: Journey;

  @ManyToOne(() => User, (user) => user.tickets, { eager: true })
  user: User;
}
