import { Router } from "express";
import {
  getItemById,
  getItemCommentById,
} from "../controllers/items.controllers";

const itemsRouter = Router();
itemsRouter.route("/:item_id").get(getItemById);
itemsRouter.route("/:item_id/comments").get(getItemCommentById);

export default itemsRouter;
