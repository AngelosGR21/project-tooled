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
const connection_1 = __importDefault(require("../connection"));
const pg_format_1 = __importDefault(require("pg-format"));
const seed = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryData, commentData, itemData, userData, favouriteData } = data;
    yield connection_1.default.query("DROP TABLE IF EXISTS categories;");
    yield connection_1.default.query("DROP TABLE IF EXISTS comments;");
    yield connection_1.default.query("DROP TABLE IF EXISTS items;");
    yield connection_1.default.query("DROP TABLE IF EXISTS users;");
    yield connection_1.default.query("DROP TABLE IF EXISTS favourites;");
    yield connection_1.default.query(`CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category VARCHAR NOT NULL
  );`);
    yield connection_1.default.query(`CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR UNIQUE,
    name VARCHAR NOT NULL,
    avatar VARCHAR,
    average_review INT DEFAULT 0 NOT NULL,
    lat VARCHAR,
    long VARCHAR,
    password VARCHAR
  );`);
    yield connection_1.default.query(`CREATE TABLE items (
    item_id SERIAL PRIMARY KEY,
    name VARCHAR,
    price INT,
    body VARCHAR,
    item_image VARCHAR DEFAULT 'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.salonlfc.com%2Fwp-content%2Fuploads%2F2018%2F01%2Fimage-not-found-1-scaled-1150x647.png&f=1&nofb=1',
    created_at TIMESTAMP DEFAULT NOW(),
    rating INT DEFAULT 0 NOT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    lat VARCHAR,
    long VARCHAR,
    user_id INT NOT NULL REFERENCES users(user_id),
    category_id INT NOT NULL REFERENCES categories(category_id)
  );`);
    yield connection_1.default.query(`CREATE TABLE comments(
    comment_id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    body VARCHAR,
    user_id INT NOT NULL REFERENCES users(user_id),
    item_id INT NOT NULL REFERENCES items(item_id)
  );`);
    yield connection_1.default.query(`CREATE TABLE favourites (
    favourite_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    item_id INT NOT NULL REFERENCES items(item_id) 
  );`);
    const insertCategoriesQueryStr = (0, pg_format_1.default)("INSERT INTO categories (category) VALUES %L RETURNING *;", categoryData.map(({ category }) => [category]));
    yield connection_1.default.query(insertCategoriesQueryStr).then((result) => result.rows);
    const insertUsersQueryStr = (0, pg_format_1.default)("INSERT INTO users ( username, name, avatar, lat,long,password) VALUES %L RETURNING *;", userData.map(({ username, name, avatar, lat, long, password }) => [
        username,
        name,
        avatar,
        lat,
        long,
        password,
    ]));
    yield connection_1.default.query(insertUsersQueryStr).then((result) => result.rows);
    const insertItemsQueryStr = (0, pg_format_1.default)("INSERT INTO items (name, price, body, user_id, category_id, item_image, created_at, is_available, lat, long ) VALUES %L RETURNING *;", itemData.map(({ name, price, body, user_id, category_id, item_image, created_at, is_available, lat, long, }) => [
        name,
        price,
        body,
        user_id,
        category_id,
        item_image,
        created_at,
        is_available,
        lat,
        long,
    ]));
    yield connection_1.default.query(insertItemsQueryStr).then((result) => result.rows);
    const insertCommentsQueryStr = (0, pg_format_1.default)(`INSERT INTO comments (created_at, user_id, body, item_id)
          VALUES %L RETURNING *;`, commentData.map(({ created_at, user_id, body, item_id }) => [
        created_at,
        user_id,
        body,
        item_id,
    ]));
    yield connection_1.default.query(insertCommentsQueryStr).then((result) => result.rows);
    const insertFavouritesQueryStr = (0, pg_format_1.default)("INSERT INTO favourites ( user_id, item_id ) VALUES %L RETURNING *;", favouriteData.map(({ user_id, item_id }) => [user_id, item_id]));
    yield connection_1.default.query(insertFavouritesQueryStr).then((result) => result.rows);
});
exports.default = seed;
