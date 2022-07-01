"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertCommentByItemId = exports.fetchItemCommentById = exports.fetchItemById = exports.fetchItems = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const fetchItems = (sort_by = "price", order = "desc", category) => __awaiter(void 0, void 0, void 0, function* () {
    const validSortBy = ["price", "rating"];
    const validOrder = ["asc", "desc"];
    let queryStr = `SELECT * FROM items 
                  LEFT JOIN categories 
                  ON categories.category_id = items.category_id`;
    const categoryVal = [];
    if (category) {
        queryStr += ` WHERE category = $1`;
        categoryVal.push(category);
    }
    if (validSortBy.includes(sort_by)) {
        queryStr += ` ORDER BY ${sort_by}`;
        if (validOrder.includes(order)) {
            queryStr += ` ${order}`;
        }
        else
            queryStr += ` DESC`;
    }
    else
        return Promise.reject({
            status: 400,
            message: "Invalid sort by",
        });
    try {
        const { rows } = yield connection_1.default.query(queryStr, categoryVal);
        return rows;
    }
    catch (error) {
        return Promise.reject(error);
    }
});
exports.fetchItems = fetchItems;
const fetchItemById = (item_id) => __awaiter(void 0, void 0, void 0, function* () {
    const itemQueryStr = `
    SELECT * 
    FROM items
    WHERE item_id = $1
`;
    const itemValue = [item_id];
    const { rows } = yield connection_1.default.query(itemQueryStr, itemValue);
    if (!rows.length) {
        return Promise.reject({
            status: 404,
            message: `item does not exist`,
        });
    }
    return rows[0];
});
exports.fetchItemById = fetchItemById;
const fetchItemCommentById = (item_id) => __awaiter(void 0, void 0, void 0, function* () {
    let commentQueryStr = `
    SELECT *
    FROM comments
    WHERE item_id = $1`;
    const commentValue = [item_id];
    const { rows } = yield connection_1.default.query(commentQueryStr, commentValue);
    return rows;
});
exports.fetchItemCommentById = fetchItemCommentById;
const insertCommentByItemId = ({ user_id, body }, item_id) => __awaiter(void 0, void 0, void 0, function* () {
    const commentQueryStr = `
    INSERT INTO comments (user_id, body, item_id)
    VALUES ($1, $2, $3)
    RETURNING user_id, body`;
    const commentValue = [user_id, body, item_id];
    const { rows } = yield connection_1.default.query(commentQueryStr, commentValue);
    return rows[0];
});
exports.insertCommentByItemId = insertCommentByItemId;
