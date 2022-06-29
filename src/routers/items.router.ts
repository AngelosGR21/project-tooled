import { Router } from "express";
import getItems from "../controllers/items.controllers";

const itemsRouter = Router();

itemsRouter.route("/").get(getItems);

export default itemsRouter;