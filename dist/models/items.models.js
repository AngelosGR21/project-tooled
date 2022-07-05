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
exports.removeComment = exports.removeItem = exports.insertItem = exports.insertCommentByItemId = exports.fetchItemCommentById = exports.fetchItemById = exports.fetchItems = void 0;
const connection_1 = __importDefault(require("../db/connection"));
const location_1 = require("../utils/location");
const fetchItems = (sort_by = "price", order = "desc", category, updatedSortBy, user) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validSortBy = updatedSortBy || ["price", "rating"];
        const validOrder = ["asc", "desc"];
        let queryStr = `SELECT * FROM items 
                    LEFT JOIN categories 
                    ON categories.category_id = items.category_id`;
        const categoryVal = [];
        if (category) {
            queryStr += ` WHERE category = $1`;
            categoryVal.push(category);
        }
        if (!validSortBy.includes(sort_by)) {
            return Promise.reject({
                status: 400,
                message: "Invalid sort by",
            });
        }
        if (validSortBy.includes(sort_by) && sort_by !== "location") {
            queryStr += ` ORDER BY ${sort_by}`;
            if (validOrder.includes(order)) {
                queryStr += ` ${order}`;
            }
            else
                queryStr += ` DESC`;
        }
        const { rows } = yield connection_1.default.query(queryStr, categoryVal);
        if (sort_by === "location" && user !== undefined) {
            const userLocation = `(${user.lat}, ${user.long})`;
            const sortedItems = yield (0, location_1.getDistanceAndSort)(userLocation, rows);
            return sortedItems;
        }
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
const insertCommentByItemId = (body, item_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!body) {
            return Promise.reject({
                status: 400,
                message: "Comment body is missing...",
            });
        }
        const commentQueryStr = `
  INSERT INTO comments (user_id, body, item_id)
  VALUES ($1, $2, $3)
  RETURNING user_id, body`;
        const commentValue = [user_id, body, item_id];
        const { rows } = yield connection_1.default.query(commentQueryStr, commentValue);
        return rows[0];
    }
    catch (e) {
        return Promise.reject(e);
    }
});
exports.insertCommentByItemId = insertCommentByItemId;
const insertItem = ({ name, price, body, user_id, category_id, item_image, is_available, lat, long, }) => __awaiter(void 0, void 0, void 0, function* () {
    const itemQueryStr = `
  INSERT INTO items (name, price, body, user_id, category_id, item_image, is_available, lat, long ) 
  VALUES  ($1, $2, $3, $4, $5, $6, $7, $8, $9 ) RETURNING *`;
    const itemValue = [
        name,
        price,
        body,
        user_id,
        category_id,
        item_image,
        is_available,
        lat,
        long,
    ];
    const { rows } = yield connection_1.default.query(itemQueryStr, itemValue);
    return rows[0];
});
exports.insertItem = insertItem;
const removeItem = (item_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id: userRows } = yield (0, exports.fetchItemById)(item_id);
    if (user_id !== userRows) {
        return Promise.reject({
            status: 401,
            message: "unauthorized request...",
        });
    }
    const removeCommentQueryStr = `
    DELETE FROM comments
    WHERE item_id = $1`;
    const removeCommentValue = [item_id];
    const commentQuery = connection_1.default.query(removeCommentQueryStr, removeCommentValue);
    const removeFavQueryStr = `
    DELETE FROM favourites
    WHERE item_id = $1`;
    const removeFavValue = [item_id];
    const favouritesQuery = connection_1.default.query(removeFavQueryStr, removeFavValue);
    yield Promise.all([commentQuery, favouritesQuery]);
    const removeItemQueryStr = `
    DELETE FROM items
    WHERE item_id = $1`;
    const removeItemValue = [item_id];
    const { rows } = yield connection_1.default.query(removeItemQueryStr, removeItemValue);
    return rows;
});
exports.removeItem = removeItem;
const removeComment = (comment_id, item_id, user_id) => __awaiter(void 0, void 0, void 0, function* () {
    const removeCommentQueryStr = `
  DELETE FROM comments
  WHERE comment_id = $1`;
    const removeCommentValue = [comment_id];
    if (comment_id) {
        const commentQueryStr = `
    SELECT comment_id,user_id,item_id
    FROM comments
    WHERE comment_id = $1`;
        const commentValue = [comment_id];
        const { rows } = yield connection_1.default.query(commentQueryStr, commentValue);
        if (!rows.length) {
            return Promise.reject({
                status: 404,
                message: `comment does not exist`,
            });
        }
        if (user_id !== rows[0].user_id) {
            return Promise.reject({
                status: 401,
                message: "unauthorized request...",
            });
        }
    }
    const { rows } = yield connection_1.default.query(removeCommentQueryStr, removeCommentValue);
    return rows;
});
exports.removeComment = removeComment;
