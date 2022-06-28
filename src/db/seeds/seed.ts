import db from "../connection";
import format from "pg-format";
import { Data, CategoryData } from "./types-seed";

const seed = async (data: Data) => {
  const { categoryData, commentData, itemData, userData, favouriteData } = data;
  await db.query("DROP TABLE IF EXISTS categories;");
  await db.query("DROP TABLE IF EXISTS comments;");
  await db.query("DROP TABLE IF EXISTS items;");
  await db.query("DROP TABLE IF EXISTS users;");
  await db.query("DROP TABLE IF EXISTS favourites;");

  await db.query(`CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category VARCHAR NOT NULL
  );`);

  await db.query(`CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR UNIQUE,
    name VARCHAR NOT NULL,
    avatar VARCHAR,
    average_review INT DEFAULT 0 NOT NULL,
    lat VARCHAR,
    long VARCHAR,
    password VARCHAR
  );`);

  await db.query(`CREATE TABLE items (
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

  await db.query(`CREATE TABLE comments(
    comment_id SERIAL PRIMARY KEY,
    created_at TIMESTAMP DEFAULT NOW(),
    body VARCHAR,
    user_id INT NOT NULL REFERENCES users(user_id),
    item_id INT NOT NULL REFERENCES items(item_id)
  );`);

  await db.query(`CREATE TABLE favourites (
    favourite_id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(user_id),
    item_id INT NOT NULL REFERENCES items(item_id) 
  );`);

  const insertCategoriesQueryStr = format(
    "INSERT INTO categories (category) VALUES %L RETURNING *;",
    categoryData.map(({ category }) => [category])
  );

  await db.query(insertCategoriesQueryStr).then((result) => result.rows);

  const insertUsersQueryStr = format(
    "INSERT INTO users ( username, name, avatar, lat,long,password) VALUES %L RETURNING *;",
    userData.map(({ username, name, avatar, lat, long, password }) => [
      username,
      name,
      avatar,
      lat,
      long,
      password,
    ])
  );

  await db.query(insertUsersQueryStr).then((result) => result.rows);

  const insertItemsQueryStr = format(
    "INSERT INTO items (name, price, body, user_id, category_id, item_image, created_at, is_available, lat, long ) VALUES %L RETURNING *;",
    itemData.map(
      ({
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
      }) => [
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
      ]
    )
  );

  await db.query(insertItemsQueryStr).then((result) => result.rows);

  const insertCommentsQueryStr = format(
    `INSERT INTO comments (created_at, user_id, body, item_id)
          VALUES %L RETURNING *;`,
    commentData.map(({ created_at, user_id, body, item_id }) => [
      created_at,
      user_id,
      body,
      item_id,
    ])
  );

  await db.query(insertCommentsQueryStr).then((result) => result.rows);

  const insertFavouritesQueryStr = format(
    "INSERT INTO favourites ( user_id, item_id ) VALUES %L RETURNING *;",
    favouriteData.map(({ user_id, item_id }) => [user_id, item_id])
  );

  await db.query(insertFavouritesQueryStr).then((result) => result.rows);
};

export default seed;
