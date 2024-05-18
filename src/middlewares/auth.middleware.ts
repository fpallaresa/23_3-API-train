import { type NextFunction, type Response } from "express";
import { verifyToken } from "../utils/token";

// Typeorm
import { User} from "../models/User";
import { AppDataSource } from "../databases/typeorm-datasource";
import { type Repository } from "typeorm";

export const isAuth = async (req: any, res: Response, next: NextFunction): Promise<null> => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");

    if (!token) {
      throw new Error("No tienes autorización para realizar esta operación" );
    }
    const userRepository: Repository<User> = AppDataSource.getRepository(User);

    // Descodificamos el token
    const decodedInfo = verifyToken(token);
    const user = await userRepository.findOne({ 
      where: {
        email: decodedInfo.userEmail,
      },
      });
    if (!user) {
      throw new Error("No tienes autorización para realizar esta operación");
    }

    req.user = user;
    next();

    return null;
  } catch (error) {
    res.status(401).json(error);
    return null;
  }
};

module.exports = { isAuth };
