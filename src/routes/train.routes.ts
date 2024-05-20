import { Router, type NextFunction, type Request, type Response } from "express";

// Typeorm
import { Train } from "../models/Train";
import { Journey } from "../models/Journey";
import { AppDataSource } from "../databases/typeorm-datasource";
import { type Repository } from "typeorm";

const trainRepository: Repository<Train> = AppDataSource.getRepository(Train);
const journeyRepository: Repository<Journey> = AppDataSource.getRepository(Journey);

// Router
export const trainRouter = Router();

// CRUD: READ
trainRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const trains: Train[] = await trainRepository.find({ 
      relations: ["journeys"] });
    res.json(trains);
  } catch (error) {
    next(error);
  }
});

trainRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const train = await trainRepository.findOne({
      where: {
        id: idReceivedInParams,
      },
      relations: ["journeys"],
    });

    if (!train) {
      res.status(404).json({ error: "Train no encontrado" });
    }

    res.json(train);
  } catch (error) {
    next(error);
  }
});


// CRUD: CREATE
trainRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newTrain = new Train();

   let journeyOfTrain;

    if (req.body.journeyId) {
      journeyOfTrain = await journeyRepository.findOne({
        where: {
          id: req.body.journeyId,
        },
      });

      if (!journeyOfTrain) {
        res.status(404).json({ error: "Journey no encontrado" });
        return;
      }
    }

    Object.assign(newTrain, {
      ...req.body,
      journey: journeyOfTrain,
    });

    const trainSaved = await trainRepository.save(newTrain);

    res.status(201).json(trainSaved);
  } catch (error) {
    next(error);
  }
});

// CRUD: DELETE
trainRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const trainToRemove = await trainRepository.findOneBy({
      id: idReceivedInParams,
    });

    if (!trainToRemove) {
      res.status(404).json({ error: "Train no encontrado" });
    } else {
      await trainRepository.remove(trainToRemove);
      res.json(trainToRemove);
    }
  } catch (error) {
    next(error);
  }
});

trainRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    // Buscar el tren para actualizar
    const trainToUpdate = await trainRepository.findOne({
      where: {
        id: idReceivedInParams,
      },
    });

    if (!trainToUpdate) {
      return res.status(404).json({ error: "Train not found" });
    }

    let journeyOfTrain;
    if (req.body.journeyId) {
      // Buscar el viaje si se proporciona journeyId
      journeyOfTrain = await journeyRepository.findOne({
        where: {
          id: req.body.journeyId,
        },
      });

      if (!journeyOfTrain) {
        return res.status(404).json({ error: "Journey not found" });
      }
    }

    // Asignar valores actualizados al tren
    Object.assign(trainToUpdate, req.body);
    if (journeyOfTrain) {
      trainToUpdate.journeys = [journeyOfTrain];
    }

    // Guardar el tren actualizado en la base de datos
    const updatedTrain = await trainRepository.save(trainToUpdate);

    res.json(updatedTrain);
  } catch (error) {
    next(error);
  }
});

