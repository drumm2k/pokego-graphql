import { ApolloServer } from 'apollo-server-express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import {} from 'dotenv/config';
import express from 'express';
import { express as voyagerMiddleware } from 'graphql-voyager/middleware';
import { verify } from 'jsonwebtoken';
import mongoose from 'mongoose';
import { checkAuthorization, createAccessToken, createRefreshToken } from './auth';
import models from './models';
import resolvers from './resolvers';
import schema from './schema';
import { sendRefreshToken } from './sendRefreshToken';

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

const server = new ApolloServer({
  typeDefs: schema,
  resolvers,
  // introspection: true,
  // playground: true,
  context: async ({ req, res }) => {
    // Get the user token from the headers
    const authHeader = req.headers.authorization || '';

    // Remove "Bearer " from auth header
    const token = authHeader.split(' ')[1];

    // Check authorization
    const user = checkAuthorization(token);

    // If not Authorized return models and res
    if (!user) return { models, res };

    // Add the user, models and res to the context
    return { user, models, res };
  },
});

const app = express();
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));
app.use(cookieParser());
app.post('/refresh_token', async (req, res) => {
  const token = req.cookies.jid;
  if (!token) {
    return res.send({ ok: false, accessToken: '' });
  }

  // Check if token is valid
  let payload;
  try {
    payload = verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return res.send({ ok: false, accessToken: '' });
  }

  // Token is valid, get the User from DB
  const user = await models.User.findById(payload.userId);
  if (!user) {
    return res.send({ ok: false, accessToken: '' });
  }

  // Check if payload refresh token version is the same as the DB
  if (user.tokenVersion !== payload.tokenVersion) {
    return res.send({ ok: false, accessToken: '' });
  }

  sendRefreshToken(res, createRefreshToken(user));

  return res.send({ ok: true, accessToken: createAccessToken(user) });
});

// Apollo Server
server.applyMiddleware({ app, cors: false });

// GraphQL Voyager
app.use('/voyager', voyagerMiddleware({ endpointUrl: '/graphql' }));

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
