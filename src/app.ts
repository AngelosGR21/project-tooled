import express, { Application } from "express";
import apiRouter from "./routers/api.router";
import itemsRouter from "./routers/items.router";
const PORT = 5000;

const app: Application = express();
app.use(express.json());

app.use("/api", apiRouter);
app.use("/api/items", itemsRouter);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`);
});

export default app;
