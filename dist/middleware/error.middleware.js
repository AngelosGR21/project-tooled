"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleServerError = exports.handleCustomError = exports.handlePSQLError = void 0;
const handlePSQLError = (err, req, res, next) => {
    if (err.code === "22P02") {
        res.status(400).send({ message: "input is not valid" });
    }
    else if (err.code === "23502") {
        res.status(400).send({ message: "input is missing" });
    }
    else if (err.code === "23503") {
        res.status(404).send({ message: "input does not exist" });
    }
    else {
        next(err);
    }
};
exports.handlePSQLError = handlePSQLError;
const handleCustomError = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ message: err.message });
    }
    else {
        next(err);
    }
};
exports.handleCustomError = handleCustomError;
const handleServerError = (err, req, res, next) => {
    res.status(500).json({ message: "internal server error" });
};
exports.handleServerError = handleServerError;
