const db = require('./db');

module.exports = {
  Query: {
    products: async () => {
      const res = await db.query('SELECT * FROM products');
      return res.rows;
    },
    product: async (_, { id }) => {
      const res = await db.query('SELECT * FROM products WHERE id = $1', [id]);
      return res.rows[0];
    },
  },
  Mutation: {
    createProduct: async (_, { name, price, stock }) => {
      const res = await db.query(
        'INSERT INTO products (name, price, stock) VALUES ($1, $2, $3) RETURNING *',
        [name, price, stock]
      );
      return res.rows[0];
    },
    updateProduct: async (_, { id, name, price, stock }) => {
      const res = await db.query(
        `UPDATE products SET
         name = COALESCE($2, name),
         price = COALESCE($3, price),
         stock = COALESCE($4, stock)
         WHERE id = $1 RETURNING *`,
        [id, name, price, stock]
      );
      return res.rows[0];
    },
    deleteProduct: async (_, { id }) => {
      const res = await db.query('DELETE FROM products WHERE id = $1', [id]);
      return res.rowCount > 0;
    },
  },
};
