const { gql } = require('graphql-tag');

module.exports = gql`
  type Product @key(fields: "id") {
    id: ID!
    name: String!
    price: Float!
    stock: Int!
  }

  type Query {
    products: [Product]
    product(id: ID!): Product
  }

  type Mutation {
    createProduct(name: String!, price: Float!, stock: Int!): Product
    updateProduct(id: ID!, name: String, price: Float, stock: Int): Product
    deleteProduct(id: ID!): Boolean
  }
`;
