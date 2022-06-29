import { ErrorRequestHandler, NextFunction, Request, Response } from "express";

export const internalServerErrorHandler = (
  err: ErrorRequestHandler,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(500).json({ message: "internal server error" });
};
