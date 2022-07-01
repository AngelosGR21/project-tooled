"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const categories_controllers_1 = require("../controllers/categories.controllers");
const categoriesRouter = (0, express_1.Router)();
categoriesRouter.route("/").get(categories_controllers_1.getAllCategories);
exports.default = categoriesRouter;
