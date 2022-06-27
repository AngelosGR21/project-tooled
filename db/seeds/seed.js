const db = require("../connection");
const format = require("pg-format");
const { createRef } = require("./utils");

const defaultImageUrl = "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.salonlfc.com%2Fwp-content%2Fuploads%2F2018%2F01%2Fimage-not-found-1-scaled-1150x647.png&f=1&nofb=1";

const seed = async (data) => {
//   const { categoryData, commentData, itemData, userData, favouriteData } = data;
  await db.query(`DROP TABLE IF EXISTS categories;`);
  await db.query(`DROP TABLE IF EXISTS comments;`);
  await db.query(`DROP TABLE IF EXISTS items;`);
  await db.query(`DROP TABLE IF EXISTS users;`);
  await db.query(`DROP TABLE IF EXISTS favourites;`);

  await db.query(`CREATE TABLE categories (
    category_id SERIAL PRIMARY KEY,
    category VARCHAR NOT NULL
  );`);

  await db.query(`CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR UNIQUE,
    name VARCHAR NOT NULL,
    avatar VARCHAR,
    average_review INT,
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
  
};

seed();
