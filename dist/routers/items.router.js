"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const items_controllers_1 = require("../controllers/items.controllers");
const authorization_middleware_1 = require("../middleware/authorization.middleware");
const itemsRouter = (0, express_1.Router)();
itemsRouter.route("/").get(authorization_middleware_1.locationAuth, items_controllers_1.getItems);
itemsRouter.route("/:item_id").get(items_controllers_1.getItemById);
itemsRouter
    .route("/:item_id/comments")
    .get(items_controllers_1.getItemCommentById)
    .post(authorization_middleware_1.postAuth, items_controllers_1.postCommentByItemId);
exports.default = itemsRouter;
