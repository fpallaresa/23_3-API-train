import express from "express";
import cors from "cors";
import { userRouter } from "./routes/user.routes";
import { journeyRouter } from "./routes/journey.routes";
import { ticketRouter } from "./routes/ticket.routes";
import { type Request, type Response, type NextFunction, type ErrorRequestHandler } from "express";
import { AppDataSource } from "./databases/typeorm-datasource";

// Conexión a la BBDD
const main = async (): Promise<void> => {
  const datasource = await AppDataSource.initialize();

  // Configuración del server
  const PORT = 3000;
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.use(
    cors({
      origin: "http://localhost:3000",
    })
  );

  // Rutas
  const router = express.Router();
  router.get("/", (req: Request, res: Response) => {
    res.send(`
      <h3>Esta es la RAIZ de nuestra API.</h3>
      <p>Estamos usando TypeORM con la BBDD: ${datasource.options.database as string}</p>
    `);
  });
  router.get("*", (req: Request, res: Response) => {
    res.status(404).send("Lo sentimos :( No hemos encontrado la página solicitada.");
  });

  // Middlewares de aplicación, por ejemplo middleware de logs en consola
  app.use((req: Request, res: Response, next: NextFunction) => {
    const date = new Date();
    console.log(`Petición de tipo ${req.method} a la url ${req.originalUrl} el ${date.toString()}`);
    next();
  });

  // Acepta /user/*
  app.use("/user", (req: Request, res: Response, next: NextFunction) => {
    console.log("Me han pedido user!!!");
    next();
  });

  // Acepta /ticket/*
  app.use("/ticket", (req: Request, res: Response, next: NextFunction) => {
    console.log("Me han pedido ticket!!!");
    next();
  });

  // Acepta /journey/*
  app.use("/journey", (req: Request, res: Response, next: NextFunction) => {
    console.log("Me han pedido journey!!!");
    next();
  });

  // Usamos las rutas
  app.use("/public", express.static("public"));
  app.use("/user", userRouter);
  app.use("/ticket", ticketRouter);
  app.use("/journey", journeyRouter);
  app.use("/", router);

  // Middleware de gestión de errores
  app.use((err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) => {
    console.log("*** INICIO DE ERROR ***");
    console.log(`PETICIÓN FALLIDA: ${req.method} a la url ${req.originalUrl}`);
    console.log(err);
    console.log("*** FIN DE ERROR ***");

    // Truco para quitar el tipo a una variable
    const errorAsAny: any = err as unknown as any;

    if (err?.name === "ValidationError") {
      res.status(400).json(err);
    } else if (errorAsAny.errmsg && errorAsAny.errmsg?.indexOf("duplicate key") !== -1) {
      res.status(400).json({ error: errorAsAny.errmsg });
    } else if (errorAsAny?.code === "ER_NO_DEFAULT_FOR_FIELD") {
      res.status(400).json({ error: errorAsAny?.sqlMessage });
    } else {
      res.status(500).json(err);
    }
  });

  app.listen(PORT, () => {
    console.log(`Server levantado en el puerto ${PORT}`);
  });
};
void main();
