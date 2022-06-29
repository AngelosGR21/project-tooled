import express, { Application, Request, Response } from "express";
import { internalServerErrorHandler } from "./middleware/error.middleware";
import apiRouter from "./routers/api.router";
import categoriesRouter from "./routers/categories.router";
const PORT = 5000;
const app: Application = express();

app.use("/api", apiRouter);
app.use("/api/categories", categoriesRouter);

app.use("/*", (req: Request, res: Response) => {
  res.status(404).send({ message: "invalid endpoint" });
});
app.use(internalServerErrorHandler);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`);
});

export default app;
