import { fetchItemById } from "../models/items.models";
import { Request, Response, NextFunction } from "express";
import { Item } from "../__test__/types-test";

export const getItemById = (
  req: Request,
  res: Response<{ items: Item[] }>,
  next: NextFunction
) => {
  const { item_id } = req.params;

  fetchItemById(item_id)
    .then((items: Item[]) => {
      res.status(200).send({ items });
    })
    .catch(next);
};
