import { Router } from "express";

import {
  getItemById,
  getItemCommentById,
  getItems,
  postItemCommentById,
} from "../controllers/items.controllers";

const itemsRouter = Router();

itemsRouter.route("/").get(getItems);
itemsRouter.route("/:item_id").get(getItemById);
itemsRouter
  .route("/:item_id/comments")
  .get(getItemCommentById)
  .post(postItemCommentById);

export default itemsRouter;
