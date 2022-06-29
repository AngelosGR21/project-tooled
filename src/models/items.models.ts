import db from "../db/connection";

const fetchItems = async (sort_by: string = "price", order: string = "desc") => {
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
        console.log(error);
        
        return Promise.reject(error);
    }
};

export default fetchItems;