import { Request, Response, NextFunction } from "express";
import { Item } from "../__test__/types-test";
import fetchItems from "../models/items.models";

const getItems = (
    req: Request<{}, {}, {}, {sort_by: string, order: string}>,
    res: Response<{items: Item[]}>,
    next: NextFunction
) => {
    const { sort_by, order } = req.query;
    fetchItems(sort_by, order)
        .then((items) => {
            res.status(200).send({ items });
        })
        .catch((err) => {
            next(err);
        });
};

export default getItems;