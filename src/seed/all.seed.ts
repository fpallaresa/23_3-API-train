import { AppDataSource } from "../databases/typeorm-datasource";
import { User } from "../models/User";
import { Train } from "../models/Train";
import { Journey } from "../models/Journey";
import { Ticket } from "../models/Ticket";

import { user1, user2 } from "./data/user.data";
import { train1, train2 } from "./data/train.data";
import { journey1, journey2 } from "./data/journey.data";
import { ticket1, ticket2 } from "./data/ticket.data";

export const userSeed = async (): Promise<void> => {
  // Nos conectamos a la BBDD
  const dataSource = await AppDataSource.initialize();
  console.log(`Tenemos conexión!! Conectados a ${dataSource?.options?.database as string}`);

  // Eliminamos los datos existentes
  await dataSource.manager.delete(Ticket, {});
  await dataSource.manager.delete(Journey, {});
  await dataSource.manager.delete(Train, {});
  await dataSource.manager.delete(User, {});
  console.log("Eliminados tickets, journeys, trains y users");

  // Creamos las entidades users
  const user1Entity = AppDataSource.manager.create(User, user1);
  const user2Entity = AppDataSource.manager.create(User, user2);

  // Guardamos users en base de datos
  await AppDataSource.manager.save(user1Entity);
  await AppDataSource.manager.save(user2Entity);

  console.log("Creados users");

  // Creamos las entidades train
  const train1Entity = dataSource.manager.create(Train, train1);
  const train2Entity = dataSource.manager.create(Train, train2);

  // Guardamos train en base de datos
  await AppDataSource.manager.save(train1Entity);
  await AppDataSource.manager.save(train2Entity);

  console.log("Creados trains");

  // Creamos las entidades journey y relaciones con train
  journey1.train = train1Entity;
  journey2.train = train2Entity;
  const journey1Entity = dataSource.manager.create(Journey, journey1);
  const journey2Entity = dataSource.manager.create(Journey, journey2);

  // Guardamos journey en base de datos
  await AppDataSource.manager.save(journey1Entity);
  await AppDataSource.manager.save(journey2Entity);

  console.log("Creados journeys");

  // Relación tickets y journeys y user
  ticket1.journey = journey1Entity;
  ticket1.user = user1Entity;
  ticket2.journey = journey2Entity;
  ticket2.user = user2Entity;

  // Creamos las entidades ticket
  const ticket1Entity = dataSource.manager.create(Ticket, ticket1);
  const ticket2Entity = dataSource.manager.create(Ticket, ticket2);

  // Guardamos tickets en base de datos
  await AppDataSource.manager.save(ticket1Entity);
  await AppDataSource.manager.save(ticket2Entity);

  console.log("Creados tickets");

  // Cerramos la conexión
  await AppDataSource.destroy();
  console.log("Cerrada conexión SQL");
};

void userSeed();
