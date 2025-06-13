const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { buildSubgraphSchema } = require('@apollo/subgraph');
const typeDefs = require('./schema');
const resolvers = require('./resolvers');
require('dotenv').config();
require('./db');

async function startServer() {
  console.log('Starting Orders service...');

  const server = new ApolloServer({
    schema: buildSubgraphSchema({ typeDefs, resolvers }),
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4002, host: '127.0.0.1' },
  });

  console.log(`Orders service ready at ${url}`);
}

startServer();
