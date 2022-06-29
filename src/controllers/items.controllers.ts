import { Request, Response, NextFunction } from "express";
import { Item } from "../__test__/types-test";
import { fetchItems, fetchItemById } from "../models/items.models";

export const getItems = (
    req: Request<{}, {}, {}, {sort_by: string, order: string, category: string}>,
    res: Response<{items: Item[]}>,
    next: NextFunction
) => {
    const { sort_by, order, category } = req.query;
    fetchItems(sort_by, order, category)
        .then((items: Item[]) => {
            res.status(200).send({ items });
        })
        .catch(next);
};

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
