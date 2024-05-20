import { Router, type NextFunction, type Request, type Response } from "express";

// Typeorm
import { Journey } from "../models/Journey";
import { Ticket } from "../models/Ticket";
import { Train } from "../models/Train";
import { AppDataSource } from "../databases/typeorm-datasource";
import { type Repository } from "typeorm";

const journeyRepository: Repository<Journey> = AppDataSource.getRepository(Journey);
const trainRepository: Repository<Train> = AppDataSource.getRepository(Train);
const ticketRepository: Repository<Ticket> = AppDataSource.getRepository(Ticket);

// Router
export const journeyRouter = Router();

// CRUD: READ
journeyRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const journey: Journey[] = await journeyRepository.find({ 
        relations: ["train", "tickets"] });
    res.json(journey);
  } catch (error) {
    next(error);
  }
});

journeyRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const journey = await journeyRepository.findOne({
      where: {
        id: idReceivedInParams,
      },
      relations: ["train", "tickets"],
    });

    if (!journey) {
      res.status(404).json({ error: "Journey no encontrado" });
    }

    res.json(journey);
  } catch (error) {
    next(error);
  }
});

// CRUD: CREATE
journeyRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newJourney = new Journey();

   let trainOfJourney;

    if (req.body.trainId) {
      trainOfJourney = await trainRepository.findOne({
        where: {
          id: req.body.trainId,
        },
      });

      if (!trainOfJourney) {
        res.status(404).json({ error: "Train no encontrado" });
        return;
      }
    }

    let ticketOfJourney;

    if (req.body.ticketId) {
      ticketOfJourney = await ticketRepository.findOne({
        where: {
          id: req.body.ticketId,
        },
      });

      if (!ticketOfJourney) {
        res.status(404).json({ error: "Ticket no encontrado" });
        return;
      }
    }

    Object.assign(newJourney, {
      ...req.body,
      train: trainOfJourney,
      ticket: ticketOfJourney,

    });

    const journeySaved = await journeyRepository.save(newJourney);

    res.status(201).json(journeySaved);
  } catch (error) {
    next(error);
  }
});

// CRUD: DELETE
journeyRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const journeyToRemove = await journeyRepository.findOneBy({
      id: idReceivedInParams,
    });

    if (!journeyToRemove) {
      res.status(404).json({ error: "Journey no encontrado" });
    } else {
      await journeyRepository.remove(journeyToRemove);
      res.json(journeyToRemove);
    }
  } catch (error) {
    next(error);
  }
});

journeyRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const journeyToUpdate = await journeyRepository.findOne({
      where: {
        id: idReceivedInParams,
      },
    });

    if (!journeyToUpdate) {
      res.status(404).json({ error: "Journey no encontrado" });
    } else {
      let ticketOfJourney;

    if (req.body.ticketId) {
      ticketOfJourney = await ticketRepository.findOne({
        where: {
          id: req.body.ticketId,
        },
      });

      if (!ticketOfJourney) {
        res.status(404).json({ error: "Ticket no encontrado" });
        return;
      }
    }

      // Asignamos valores
      Object.assign(journeyToUpdate, {
        ...req.body,
        ticket: ticketOfJourney,
      });

      const updatedJourney = await journeyRepository.save(journeyToUpdate);
      res.json(updatedJourney);
    }
  } catch (error) {
    next(error);
  }
});
