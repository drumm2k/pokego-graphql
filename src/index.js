const express = require('express');
const { express: voyagerMiddleware } = require('graphql-voyager/middleware');
const { ApolloServer, gql } = require('apollo-server-express');

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
