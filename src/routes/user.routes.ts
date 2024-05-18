import { Router, type NextFunction, type Request, type Response } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/token";

// Typeorm
import { User} from "../models/User";
import { Ticket } from "../models/Ticket";
import { AppDataSource } from "../databases/typeorm-datasource";
import { type Repository } from "typeorm";

const userRepository: Repository<User> = AppDataSource.getRepository(User);
const ticketRepository: Repository<Ticket> = AppDataSource.getRepository(Ticket);

// Router
export const userRouter = Router();

// CRUD: READ
userRouter.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users: User[] = await userRepository.find({ 
        relations: ["tickets"] });
    res.json(users);
  } catch (error) {
    next(error);
  }
});

userRouter.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const user = await userRepository.findOne({
      where: {
        id: idReceivedInParams,
      },
      relations: ["tickets"],
    });

    if (!user) {
      res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
});


// CRUD: CREATE
userRouter.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const newUser = new User();

   let ticketOfUser;

    if (req.body.ticketId) {
      ticketOfUser = await ticketRepository.findOne({
        where: {
          id: req.body.ticketId,
        },
      });

      if (!ticketOfUser) {
        res.status(404).json({ error: "Ticket not found" });
        return;
      }
    }

    Object.assign(newUser, {
      ...req.body,
      ticket: ticketOfUser,
    });

    const userSaved = await userRepository.save(newUser);

    res.status(201).json(userSaved);
  } catch (error) {
    next(error);
  }
});

// CRUD: DELETE
userRouter.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const userToRemove = await userRepository.findOneBy({
      id: idReceivedInParams,
    });

    if (!userToRemove) {
      res.status(404).json({ error: "User not found" });
    } else {
      await userRepository.remove(userToRemove);
      res.json(userToRemove);
    }
  } catch (error) {
    next(error);
  }
});

userRouter.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const idReceivedInParams = parseInt(req.params.id);

    const userToUpdate = await userRepository.findOneBy({
      id: idReceivedInParams,
    });

    if (!userToUpdate) {
      res.status(404).json({ error: "User not found" });
    } else {
      let ticketOfUser;

    if (req.body.ticketId) {
      ticketOfUser = await ticketRepository.findOne({
        where: {
          id: req.body.ticketId,
        },
      });

      if (!ticketOfUser) {
        res.status(404).json({ error: "Ticket not found" });
        return;
      }
    }

      // Asignamos valores
      Object.assign(userToUpdate, {
        ...req.body,
        ticket: ticketOfUser,
      });

      const updatedStudent = await userRepository.save(userToUpdate);
      res.json(updatedStudent);
    }
  } catch (error) {
    next(error);
  }
});

// LOGIN DE USUARIOS
userRouter.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Se deben especificar los campos email y password" });
    }

    const user = await userRepository
    .createQueryBuilder("user")
    .addSelect("user.password")
    .where("user.email = :email", { email })
    .getOne();

    if (!user) {
      return res.status(401).json({ error: "Email y/o contraseña incorrectos" });
    }

    // Comprueba la pass
    const match = await bcrypt.compare(password, user.password);
    if (match) {

      // Generamos token JWT
      const jwtToken = generateToken(user.id.toString(), user.email);

      return res.status(200).json({ token: jwtToken });
    } else {
      return res.status(401).json({ error: "Email y/o contraseña incorrectos" });
    }
  } catch (error) {
    next(error);
  }
});
