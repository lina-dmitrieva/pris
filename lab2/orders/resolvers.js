const db = require('./db');

module.exports = {
  Query: {
    orders: async () => {
      const result = await db.query('SELECT * FROM orders', []);
      return result.rows.map(row => ({
        id: row.id,
        userId: row.user_id,
        productIds: row.product_ids,
        total: row.total,
      }));
    },
    order: async (_, { id }) => {
      const result = await db.query('SELECT * FROM orders WHERE id = $1', [id]);
      const row = result.rows[0];
      return row
        ? {
            id: row.id,
            userId: row.user_id,
            productIds: row.product_ids,
            total: row.total,
          }
        : null;
    },
  },
  Mutation: {
    createOrder: async (_, { userId, productIds, total }) => {
      const result = await db.query(
        'INSERT INTO orders (user_id, product_ids, total) VALUES ($1, $2, $3) RETURNING *',
        [userId, productIds, total]
      );
      const row = result.rows[0];
      return {
        id: row.id,
        userId: row.user_id,
        productIds: row.product_ids,
        total: row.total,
      };
    },
     updateOrder: async (_, { id, userId, productIds, total }) => {
    const result = await db.query(
      `UPDATE orders 
       SET user_id = COALESCE($2, user_id), 
           product_ids = COALESCE($3, product_ids), 
           total = COALESCE($4, total)
       WHERE id = $1
       RETURNING *`,
      [id, userId, productIds, total]
    );
    const row = result.rows[0];
    if (!row) return null;
    return {
      id: row.id,
      userId: row.user_id,
      productIds: row.product_ids,
      total: row.total,
    };
  },

  deleteOrder: async (_, { id }) => {
    const result = await db.query('DELETE FROM orders WHERE id = $1 RETURNING *', [id]);
    return !!result.rows.length;
  },
  },
};
