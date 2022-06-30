import { ErrorRequestHandler } from "express";



export const handleCustomError: ErrorRequestHandler = (err, req, res, next) => {
    if (err.status) {
        res.status(err.status).send({ message: err.message });
    } else {
        next(err);
    }
};

export const handleServerError: ErrorRequestHandler = (err, req, res, next) => {
    res.status(500).json({ message: "internal server error" });
};