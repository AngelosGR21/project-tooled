"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controllers_1 = require("../controllers/users.controllers");
const usersRouter = (0, express_1.Router)();
usersRouter.route("/")
    .post(users_controllers_1.postUser);
usersRouter.route("/login")
    .post(users_controllers_1.loginUser);
exports.default = usersRouter;
