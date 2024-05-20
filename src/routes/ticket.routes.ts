import { Router, type NextFunction, type Request, type Response } from "express";
import { generateRandomAlphanumeric } from "../utils/utils";

// Typeorm
import { Ticket } from "../models/Ticket";
import { User } from "../models/User";
import { Journey } from "../models/Journey";
import { AppDataSource } from "../databases/typeorm-datasource";
import { type Repository } from "typeorm";

const ticketRepository: Repository<Ticket> = AppDataSource.getRepository(Ticket);
const userRepository: Repository<User> = AppDataSource.getRepository(User);
const journeyRepository: Repository<Journey> = AppDataSource.getRepository(Journey);

// Router
export const ticketRouter = Router();

// CRUD: READ
ticketRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const tickets: Ticket[] = await ticketRepository.find({
      relations: ["user", "journey"],
    });
    res.json(tickets);
  } catch (error) {
    next(error);
  }
});

ticketRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const ticket = await ticketRepository.findOne({
      where: {
        id: idReceivedInParams,
      },
      relations: ["user", "journey"],
    });

    if (!ticket) {
      res.status(404).json({ error: "Ticket no encontrado" });
    }

    res.json(ticket);
  } catch (error) {
    next(error);
  }
});

// CRUD: CREATE
ticketRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { journeyId, userId, seatType, isPaid } = req.body;

    if (!journeyId || !userId || !seatType) {
      return res.status(400).json({ error: "El ID del Viaje, Usuario y Tipo de asiento son requeridos" });
    }

    // Obtener la entidad Journey
    const journey = await journeyRepository.findOne({ where: { id: journeyId } });
    if (!journey) {
      return res.status(404).json({ error: "Viaje no encontrado" });
    }

    // Obtener la entidad User
    const user = await userRepository.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const existingTicket = await ticketRepository.findOne({
      where: {
        journey: journey,
        user: user,
      },
    });

    // Crear el nuevo ticket
    const newTicket = new Ticket();
    newTicket.locator = generateRandomAlphanumeric(10);
    newTicket.isPaid = isPaid;
    newTicket.seatType = seatType;
    newTicket.journey = journey;
    newTicket.user = user;

    // Guardar el ticket en la base de datos
    const ticketSaved = await ticketRepository.save(newTicket);

    res.status(201).json(ticketSaved);
  } catch (error) {
    next(error);
  }
});


// CRUD: DELETE
ticketRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const ticketToRemove = await ticketRepository.findOneBy({
      id: idReceivedInParams,
    });

    if (!ticketToRemove) {
      res.status(404).json({ error: "Ticket no encontrado" });
    } else {
      await ticketRepository.remove(ticketToRemove);
      res.json(ticketToRemove);
    }
  } catch (error) {
    next(error);
  }
});

ticketRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    // Buscar el ticket para actualizar
    const ticketToUpdate = await ticketRepository.findOne({
      where: {
        id: idReceivedInParams,
      },
    });

    if (!ticketToUpdate) {
      return res.status(404).json({ error: "Ticket no encontrado" });
    }

    // Buscar el usuario si se proporciona userId
    let userOfTicket;
    if (req.body.userId) {
      userOfTicket = await userRepository.findOne({
        where: {
          id: req.body.userId,
        },
      });

      if (!userOfTicket) {
        return res.status(404).json({ error: "Usuario no encontrado" });
      }
    }

    // Buscar el viaje si se proporciona journeyId
    let journeyOfTicket;
    if (req.body.journeyId) {
      journeyOfTicket = await journeyRepository.findOne({
        where: {
          id: req.body.journeyId,
        },
      });

      if (!journeyOfTicket) {
        return res.status(404).json({ error: "Journey no encontrado" });
      }
    }

    // Asignar valores actualizados al ticket
    Object.assign(ticketToUpdate, req.body);
    if (userOfTicket) {
      ticketToUpdate.user = userOfTicket;
    }
    if (journeyOfTicket) {
      ticketToUpdate.journey = journeyOfTicket;
    }

    // Guardar el ticket actualizado en la base de datos
    const updatedTicket = await ticketRepository.save(ticketToUpdate);

    res.json(updatedTicket);
  } catch (error) {
    next(error);
  }
});
