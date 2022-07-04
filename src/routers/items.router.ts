import { Router } from "express";

import {
  getItemById,
  getItemCommentById,
  getItems,
  postItem,
  postCommentByItemId,
  deleteItem,
} from "../controllers/items.controllers";

import { locationAuth, postAuth } from "../middleware/authorization.middleware";

const itemsRouter = Router();

itemsRouter
  .route("/")
  .get(locationAuth, getItems)
  .post(postItem)
  .delete(postAuth, deleteItem);
itemsRouter.route("/:item_id").get(getItemById);
itemsRouter
  .route("/:item_id/comments")
  .get(getItemCommentById)
  .post(postAuth, postCommentByItemId);

export default itemsRouter;
