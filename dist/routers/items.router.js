"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const items_controllers_1 = require("../controllers/items.controllers");
const authorization_middleware_1 = require("../middleware/authorization.middleware");
const itemsRouter = (0, express_1.Router)();
itemsRouter.route("/").get(authorization_middleware_1.locationAuth, items_controllers_1.getItems).post(items_controllers_1.postItem);
itemsRouter.route("/:item_id").get(items_controllers_1.getItemById).delete(authorization_middleware_1.postAuth, items_controllers_1.deleteItem);
itemsRouter
    .route("/:item_id/comments")
    .get(items_controllers_1.getItemCommentById)
    .post(authorization_middleware_1.postAuth, items_controllers_1.postCommentByItemId);
itemsRouter.route("/:item_id/:comment_id").delete(authorization_middleware_1.postAuth, items_controllers_1.deleteComment);
exports.default = itemsRouter;
