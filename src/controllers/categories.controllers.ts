import { fetchAllCategories } from "../models/categories.models";
import { Request, Response, NextFunction } from "express";
import { Category } from "../__test__/types-test";

export const getAllCategories = (
  req: Request,
  res: Response<{ categories: Category[] }>,
  next: NextFunction
) => {
  fetchAllCategories()
    .then((categories: Category[]) => {
      res.status(200).send({ categories });
    })
    .catch(next);
};
