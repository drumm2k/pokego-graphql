import express from 'express';
import { ApolloServer, gql } from 'apollo-server-express';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
require('./config');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
});

const app = express();
app.use('/voyager', voyagerMiddleware({ endpointUrl: '/graphql' }));
server.applyMiddleware({ app });

app.listen({ port: process.env.PORT || 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
