import express, { Application } from "express";
import apiRouter from "./routers/api.router";
import categoriesRouter from "./routers/categories.router";
const PORT = 5000;
const app: Application = express();

app.use("/api", apiRouter);
app.use("/api/categories", categoriesRouter);

app.use("/*", (req, res, next) => {
  res.status(404).send({ message: "invalid endpoint" });
});

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`);
});

export default app;
