"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.postItem = exports.postCommentByItemId = exports.getItemCommentById = exports.getItemById = exports.getItems = void 0;
const items_models_1 = require("../models/items.models");
const getItems = (req, res, next) => {
    const { sort_by, order, category } = req.query;
    (0, items_models_1.fetchItems)(sort_by, order, category, res.locals.updatedSortBy, res.locals.user)
        .then((items) => {
        if (res.locals.tokenError) {
            const { tokenError } = res.locals;
            return res.status(200).json({ items, tokenError });
        }
        res.status(200).json({ items });
    })
        .catch(next);
};
exports.getItems = getItems;
const getItemById = (req, res, next) => {
    const { item_id } = req.params;
    (0, items_models_1.fetchItemById)(item_id)
        .then((items) => {
        res.status(200).send({ items });
    })
        .catch(next);
};
exports.getItemById = getItemById;
const getItemCommentById = (req, res, next) => {
    const { item_id } = req.params;
    (0, items_models_1.fetchItemCommentById)(item_id)
        .then((comments) => {
        res.status(200).send({ comments });
    })
        .catch(next);
};
exports.getItemCommentById = getItemCommentById;
const postCommentByItemId = (req, res, next) => {
    const { body } = req.body;
    const { item_id } = req.params;
    const { user_id } = res.locals.user;
    (0, items_models_1.insertCommentByItemId)(body, item_id, user_id)
        .then((comment) => {
        res.status(201).json({ comment });
    })
        .catch(next);
};
exports.postCommentByItemId = postCommentByItemId;
const postItem = (req, res, next) => {
    const { body } = req;
    (0, items_models_1.insertItem)(body)
        .then((item) => {
        res.status(201).send({ item });
    })
        .catch(next);
};
exports.postItem = postItem;
