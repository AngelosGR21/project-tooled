import db from "../db/connection";
import { CommentBody, ItemBody } from "../__test__/types-test";
import { UserDetails } from "../types/user.types";
import { getDistanceAndSort } from "../utils/location";

export const fetchItems = async (
  sort_by: string = "price",
  order: string = "desc",
  category: string,
  updatedSortBy: string[] | undefined,
  user: UserDetails | undefined
) => {
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
      } else queryStr += ` DESC`;
    }

    const { rows } = await db.query(queryStr, categoryVal);

    if (sort_by === "location" && user !== undefined) {
      const userLocation = `(${user.lat}, ${user.long})`;
      const sortedItems = await getDistanceAndSort(userLocation, rows);
      return sortedItems;
    }

    return rows;
  } catch (error) {
    return Promise.reject(error);
  }
};

export const fetchItemById = async (item_id: string) => {
  const itemQueryStr = `
    SELECT * 
    FROM items
    WHERE item_id = $1
`;
  const itemValue = [item_id];
  const { rows } = await db.query(itemQueryStr, itemValue);

  if (!rows.length) {
    return Promise.reject({
      status: 404,
      message: `item does not exist`,
    });
  }

  return rows[0];
};

export const fetchItemCommentById = async (item_id: string) => {
  let commentQueryStr = `
  SELECT *
  FROM comments
  WHERE item_id = $1`;
  const commentValue = [item_id];

  const { rows } = await db.query(commentQueryStr, commentValue);

  return rows;
};

export const insertCommentByItemId = async (
  body: string,
  item_id: string,
  user_id: number
) => {
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
    const { rows } = await db.query(commentQueryStr, commentValue);
    return rows[0];
  } catch (e) {
    return Promise.reject(e);
  }
};

export const insertItem = async ({
  name,
  price,
  body,
  user_id,
  category_id,
  item_image,
  is_available,
  lat,
  long,
}: ItemBody) => {
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

  const { rows } = await db.query(itemQueryStr, itemValue);

  return rows[0];
};

export const removeItem = async (item_id: string, user_id: number) => {
  const itemQueryStr = `
    SELECT *
    FROM items
    WHERE item_id = $1
    `;
  const itemValue = [item_id];
  const { rows: rowsItems } = await db.query(itemQueryStr, itemValue);
  const { user_id: userRows } = rowsItems[0];

  if (!user_id === userRows) {
    return Promise.reject({
      status: 401,
      message: "Incorrect user...",
    });
  }
  const removeCommentQueryStr = `
    DELETE FROM comments
    WHERE item_id = $1`;
  const removeCommentValue = [item_id];

  const commentQuery = db.query(removeCommentQueryStr, removeCommentValue);

  const removeFavQueryStr = `
    DELETE FROM favourites
    WHERE item_id = $1`;
  const removeFavValue = [item_id];

  const favouritesQuery = db.query(removeFavQueryStr, removeFavValue);

  await Promise.all([commentQuery, favouritesQuery]);

  const removeItemQueryStr = `
    DELETE FROM items
    WHERE item_id = $1`;
  const removeItemValue = [item_id];

  const { rows } = await db.query(removeItemQueryStr, removeItemValue);

  return rows;
};

export const removeComment = async (comment_id: string, user_id: number) => {
  const res = await fetchItemCommentById(comment_id);
  console.log(res);

  // if (user_id !== userRows) {
  //   return Promise.reject({
  //     status: 401,
  //     message: "unauthorized request...",
  //   });
  // }

  // const removeCommentQueryStr = `
  //   DELETE FROM comments
  //   WHERE comment_id = $1`;
  // const removeCommentValue = [comment_id];

  // const commentQuery = db.query(removeCommentQueryStr, removeCommentValue);

  // const removeFavQueryStr = `
  //   DELETE FROM favourites
  //   WHERE comment_id = $1`;
  // const removeFavValue = [comment_id];

  // const favouritesQuery = db.query(removeFavQueryStr, removeFavValue);

  // await Promise.all([commentQuery, favouritesQuery]);

  // const removeItemQueryStr = `
  //   DELETE FROM items
  //   WHERE comment_id = $1`;
  // const removeItemValue = [comment_id];

  // const { rows } = await db.query(removeItemQueryStr, removeItemValue);

  // return rows;
};
