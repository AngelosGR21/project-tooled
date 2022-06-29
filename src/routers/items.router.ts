import { Router } from "express";
import { getItemById } from "../controllers/items.controllers";

const itemsRouter = Router();
itemsRouter.route("/:item_id").get(getItemById);

export default itemsRouter;
