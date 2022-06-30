import { Router } from "express";
import { getItems, getItemById } from "../controllers/items.controllers";

const itemsRouter = Router();

itemsRouter.route("/").get(getItems);
itemsRouter.route("/:item_id").get(getItemById);


export default itemsRouter;
