"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllCategories = void 0;
const categories_models_1 = require("../models/categories.models");
const getAllCategories = (req, res, next) => {
    (0, categories_models_1.fetchAllCategories)()
        .then((categories) => {
        res.status(200).send({ categories });
    })
        .catch(next);
};
exports.getAllCategories = getAllCategories;
