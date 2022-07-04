"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postUser = exports.loginUser = void 0;
//models
const users_models_1 = require("../models/users.models");
const loginUser = (req, res, next) => {
    (0, users_models_1.verifyUser)(req.body).then((token) => {
        res.setHeader("X-Application-Token", token);
        res.status(200).json({ message: "Login successful!" });
    }).catch(next);
};
exports.loginUser = loginUser;
const postUser = (req, res, next) => {
    (0, users_models_1.insertUser)(req.body).then((token) => {
        res.setHeader("X-Application-Token", token);
        res.status(201).json({ message: "User created!" });
    }).catch(next);
};
exports.postUser = postUser;
