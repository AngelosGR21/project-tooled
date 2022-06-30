import express, { Application } from "express";
import apiRouter from "./routers/api.router";
import usersRouter from "./routers/users.router";
import { handleCustomError, handleServerError } from "./middleware/error.middleware";

const PORT = 5000;
const app: Application = express();

app.use(express.json());


app.use("/api", apiRouter);
app.use("/api/users", usersRouter);


app.use(handleCustomError);
app.use(handleServerError);


app.listen(PORT, () => {
  console.log(`Listening on ${PORT}...`);
});

export default app;
