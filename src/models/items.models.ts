import db from "../db/connection";

export const fetchItems = async (sort_by: string = "price", order: string = "desc") => {
    const validSortBy = ["price", "rating"];
    const validOrder = ["asc", "desc"];
    
    let queryStr = `SELECT * FROM items`;

    if (validSortBy.includes(sort_by)) {
        queryStr += ` ORDER BY ${sort_by}`;
        if (validOrder.includes(order)) {
            queryStr += ` ${order}`;
        } else queryStr += ` DESC`;
    }
    
    try {
        const { rows } = await db.query(queryStr);
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
