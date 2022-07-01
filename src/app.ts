import express, { Application, Request, Response } from "express";
import cors from "cors";
import {
  handleCustomError,
  handlePSQLError,
  handleServerError,
} from "./middleware/error.middleware";
import apiRouter from "./routers/api.router";
import usersRouter from "./routers/users.router";
import categoriesRouter from "./routers/categories.router";
import itemsRouter from "./routers/items.router";

const { PORT = 5000 } = process.env;

const app: Application = express();
app.use(cors());
app.use(express.json());

app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.status(200).send("api up and running");
});

app.use("/api", apiRouter);
app.use("/api/users", usersRouter);
app.use("/api/items", itemsRouter);
app.use("/api/categories", categoriesRouter);

app.use("/*", (req: Request, res: Response) => {
  res.status(404).send({ message: "invalid endpoint" });
});

app.use(handlePSQLError);
app.use(handleCustomError);
app.use(handleServerError);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`);
});

export default app;
