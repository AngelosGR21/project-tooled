"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const categories_1 = __importDefault(require("./categories"));
const comments_1 = __importDefault(require("./comments"));
const items_1 = __importDefault(require("./items"));
const users_1 = __importDefault(require("./users"));
const favourites_1 = __importDefault(require("./favourites"));
const testData = {
    categoryData: categories_1.default,
    commentData: comments_1.default,
    itemData: items_1.default,
    userData: users_1.default,
    favouriteData: favourites_1.default,
};
exports.default = testData;
