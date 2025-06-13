const { gql } = require('graphql-tag');

module.exports = gql`
  type Order {
    id: ID!
    userId: ID!
    productIds: [ID!]!
    total: Float!
  }

  type Query {
    orders: [Order]
    order(id: ID!): Order
  }

  type Mutation {
    createOrder(userId: ID!, productIds: [ID!]!, total: Float!): Order
    updateOrder(id: ID!, userId: ID, productIds: [ID!], total: Float): Order
    deleteOrder(id: ID!): Boolean
  }
`;
