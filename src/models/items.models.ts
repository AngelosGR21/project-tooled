import db from "../db/connection";

export const fetchItemById = async (item_id: string) => {
  const reviewQueryStr = `
    SELECT * 
    FROM items
    WHERE item_id = $1
`;
  const reviewValue = [item_id];
  const { rows } = await db.query(reviewQueryStr, reviewValue);

  return rows[0];
};
