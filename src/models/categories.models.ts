import db from "../db/connection";

export const fetchAllCategories = async () => {
  const { rows } = await db.query(`SELECT * FROM categories`);
  console.log(rows);

  return rows;
};
