import { gql } from 'apollo-server-express';

const UserSchema = gql`
  # *****************************
  # Type Objects
  # *****************************
  type User {
    id: ID!
    userName: String!
    email: String!
    password: String
    confirmed: Boolean!
    roles: [String]!
    trainer: Trainer
    location: Location
    telegram: String
    followers: [Follow]!
    following: [Follow]!
    tradeLists: [TradeList]!
    isBanned: Boolean
    isOnline: Boolean
    createdAt: String!
    updatedAt: String!
  }

  type Trainer {
    team: String
    level: Int
    code: String
  }

  type Location {
    latitude: Float
    longtitude: Float
  }

  type Token {
    id: ID!
    token: String!
    tokenExpiration: Int!
  }

  # *****************************
  # Input Objects
  # *****************************
  input RegisterInput {
    userName: String!
    email: String!
    password: String!
    trainer: TrainerInput
    location: LocationInput
    telegram: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input TrainerInput {
    team: String
    level: Int
    code: String
  }

  input LocationInput {
    latitude: Float
    longtitude: Float
  }

  # *****************************
  # Queries
  # *****************************
  extend type Query {
    # Get all Users
    getUsers: [User!]!

    # Get User by username
    getUser(userName: String!): User!
  }

  # *****************************
  # Mutations
  # *****************************
  extend type Mutation {
    # Register User
    register(input: RegisterInput!): User

    # Log in User
    login(input: LoginInput!): Token!
  }
`;

export default UserSchema;
