import { Request, Response, NextFunction } from "express";

const getApi = (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json("successful :)");
};

export default getApi;
