"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getApi = (req, res, next) => {
    res.status(200).json("successful :)");
};
exports.default = getApi;
