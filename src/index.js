import {} from 'dotenv/config';
import express from 'express';
import jwt from 'jsonwebtoken';
import { ApolloServer } from 'apollo-server-express';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import mongoose from 'mongoose';

import schema from './schema';
import resolvers from './resolvers';

// Connect to DB
mongoose
  .connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => console.log(`Connected to DB at ${process.env.MONGO_URI}`))
  .catch((err) => {
    console.log(`DB connection error: ${err.message}`);
  });

const checkAuthorization = (token) => {
  try {
    const authUser = jwt.verify(token, process.env.JWT_SECRET);
    if (authUser) {
      return authUser;
    }
  } catch (error) {
    return;
  }
};

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  // introspection: true,
  // playground: true,
  context: async ({ req }) => {
    // Get the user token from the headers
    const authHeader = req.headers.authorization || '';
    if (!authHeader) return;

    // Split token
    const token = authHeader.split(' ')[1];
    if (!token || token === '') return;

    // Check authorization
    const user = checkAuthorization(token);
    if (!user) return;

    // Add the user to the context
    return { user };
  },
});

const app = express();
app.use('/voyager', voyagerMiddleware({ endpointUrl: '/graphql' }));
server.applyMiddleware({ app });

app.listen({ port: process.env.PORT || 4000 }, () =>
  console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);

const gracefulExit = () => {
  mongoose.connection.close(false, () => {
    console.log('MongoDb connection closed.');
    process.exit(0);
  });
};

process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);
