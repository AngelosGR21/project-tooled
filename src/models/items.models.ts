import db from "../db/connection";

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
