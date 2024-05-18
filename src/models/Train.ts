import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Journey } from './Journey';

@Entity()
export class Train {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  vipSeats: number;

  @Column()
  businessSeats: number;

  @Column()
  normalSeats: number;

  @OneToMany(() => Journey, (journey) => journey.train)
  journeys: Journey[];
}