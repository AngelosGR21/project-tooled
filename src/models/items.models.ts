import db from "../db/connection";
import { CommentBody } from "../__test__/types-test";

export const fetchItems = async (
  sort_by: string = "price",
  order: string = "desc",
  category: string
) => {
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
    } else queryStr += ` DESC`;
  } else
    return Promise.reject({
      status: 400,
      message: "Invalid sort by",
    });

  try {
    const { rows } = await db.query(queryStr, categoryVal);
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
  { user_id, body }: CommentBody,
  item_id: string
) => {
  const commentQueryStr = `
    INSERT INTO comments (user_id, body, item_id)
    VALUES ($1, $2, $3)
    RETURNING user_id, body`;
  const commentValue = [user_id, body, item_id];

  const { rows } = await db.query(commentQueryStr, commentValue);

  return rows[0];
};
