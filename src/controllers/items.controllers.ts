import {
  fetchItems,
  fetchItemById,
  fetchItemCommentById,
  insertCommentByItemId,
  insertItem,
  removeItem,
  removeComment,
} from "../models/items.models";
import { Request, Response, NextFunction } from "express";
import { Comment, CommentBody, Item, ItemBody } from "../__test__/types-test";
import { ILocals } from "../types/items.types";

export const getItems = (
  req: Request<
    {},
    {},
    {},
    { sort_by: string; order: string; category: string }
  >,
  res: Response<{}, ILocals>,
  next: NextFunction
) => {
  const { sort_by, order, category } = req.query;

  fetchItems(
    sort_by,
    order,
    category,
    res.locals.updatedSortBy,
    res.locals.user
  )
    .then((items) => {
      if (res.locals.tokenError) {
        const { tokenError } = res.locals;
        return res.status(200).json({ items, tokenError });
      }
      res.status(200).json({ items });
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

export const getItemCommentById = (
  req: Request,
  res: Response<{ comments: Comment[] }>,
  next: NextFunction
) => {
  const { item_id } = req.params;

  fetchItemCommentById(item_id)
    .then((comments: Comment[]) => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

export const postCommentByItemId = (
  req: Request<{ item_id: string }, {}, CommentBody>,
  res: Response<{ comment: Comment }>,
  next: NextFunction
) => {
  const { body } = req.body;
  const { item_id } = req.params;
  const { user_id } = res.locals.user;

  insertCommentByItemId(body, item_id, user_id)
    .then((comment: Comment) => {
      res.status(201).json({ comment });
    })
    .catch(next);
};

export const postItem = (
  req: Request<{}, {}, ItemBody>,
  res: Response<{ item: Item }>,
  next: NextFunction
) => {
  const { body } = req;

  insertItem(body)
    .then((item: Item) => {
      res.status(201).send({ item });
    })
    .catch(next);
};

export const deleteItem = (
  req: Request<{ item_id: string }, {}>,
  res: Response<{ item: {} }, ILocals>,
  next: NextFunction
) => {
  const { item_id } = req.params;
  const { user_id } = res.locals.user;

  removeItem(item_id, user_id)
    .then((item: {}) => {
      res.status(204).send({ item });
    })
    .catch(next);
};

export const deleteComment = (
  req: Request<{ comment_id: string; item_id: string }, {}>,
  res: Response<{ comment: {} }, ILocals>,
  next: NextFunction
) => {
  const { comment_id, item_id } = req.params;
  const { user_id } = res.locals.user;

  removeComment(comment_id, item_id, user_id)
    .then((comment: {}) => {
      res.status(204).send({ comment });
    })
    .catch(next);
};
