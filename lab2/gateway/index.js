const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');
const { ApolloGateway, IntrospectAndCompose } = require('@apollo/gateway');

const gateway = new ApolloGateway({
  supergraphSdl: new IntrospectAndCompose({
    subgraphs: [
      { name: 'users', url: 'http://127.0.0.1:4001/graphql' },
      { name: 'orders', url: 'http://127.0.0.1:4002/graphql' },
      { name: 'products', url: 'http://127.0.0.1:4003/graphql' },
    ],
    pollIntervalInMs: 5000,
  }),
  experimental_didFailComposition: ({ errors }) => {
    console.error('Gateway composition failed:', errors);
  },
});

async function startGateway() {
  const server = new ApolloServer({
    gateway,
    introspection: process.env.NODE_ENV !== 'production',
    plugins: [
      {
        async serverWillStart() {
          console.log('Gateway starting with following services:');
          console.log('- Users: http://localhost:4001/graphql');
          console.log('- Orders: http://localhost:4002/graphql');
          console.log('- Products: http://localhost:4003/graphql');
        },
      },
    ],
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(` Gateway ready at ${url}`);
  console.log(`Explore at: ${url}graphql`);
}

startGateway().catch(err => {
  console.error('Failed to start gateway:', err);
  process.exit(1);
});