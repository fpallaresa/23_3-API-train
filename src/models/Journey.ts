import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from 'typeorm';
import { Train } from './Train';
import { Ticket } from './Ticket';

@Entity()
export class Journey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  departureTime: Date;

  @Column()
  arrivalTime: Date;

  @Column()
  originCity: string;

  @Column()
  destinationCity: string;

  @Column()
  price: number;

  @ManyToOne(() => Train, (train) => train.journeys)
  train: Train;

  @OneToMany(() => Ticket, (ticket) => ticket.journey)
  tickets: Ticket[];
}
