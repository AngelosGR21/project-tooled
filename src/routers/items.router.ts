import { Router } from "express";

import {
  getItemById,
  getItemCommentById,
  getItems,
  postCommentByItemId,
} from "../controllers/items.controllers";

import { locationAuth } from "../middleware/authorization.middleware";

const itemsRouter = Router();

itemsRouter.route("/").get(locationAuth, getItems);
itemsRouter.route("/:item_id").get(getItemById);
itemsRouter
  .route("/:item_id/comments")
  .get(getItemCommentById)
  .post(postCommentByItemId);

export default itemsRouter;
