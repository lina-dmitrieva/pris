const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const gql = require('graphql-tag');

const typeDefs = gql`
  type User @key(fields: "id") {
    id: ID!
    name: String
    email: String
  }

  type Query {
    users: [User]
    user(id: ID!): User
  }

  type Mutation {
    createUser(name: String!, email: String!): User
    updateUser(id: ID!, name: String, email: String): User
    deleteUser(id: ID!): Boolean
  }
`;


const users = [];

const resolvers = {
  Query: {
    users: () => users,
    user: (_, { id }) => users.find(u => u.id === id),
  },
  Mutation: {
    createUser: (_, { name, email }) => {
      const user = { id: `${users.length + 1}`, name, email };
      users.push(user);
      return user;
    },
    updateUser: (_, { id, name, email }) => {
      const user = users.find(u => u.id === id);
      if (!user) return null;
      if (name !== undefined) user.name = name;
      if (email !== undefined) user.email = email;
      return user;
    },
    deleteUser: (_, { id }) => {
      const index = users.findIndex(u => u.id === id);
      if (index === -1) return false;
      users.splice(index, 1);
      return true;
    }
  }
};


async function start() {
  const server = new ApolloServer({
    schema: buildSubgraphSchema([{ typeDefs, resolvers }]),
    introspection: true,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4001 },
  });

  console.log(` Federated users subgraph ready at ${url}`);
}

start();
