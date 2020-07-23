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
    userId: ID!
    userName: String!
    token: String!
    tokenExpiration: Int!
  }

  # *****************************
  # Input Objects
  # *****************************
  input SignUpInput {
    userName: String!
    email: String!
    password: String!
    trainer: TrainerInput!
    location: LocationInput
    telegram: String
  }

  input LoginInput {
    email: String!
    password: String!
  }

  input TrainerInput {
    team: String!
    level: Int!
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

    # Confirm registration
    confirm(token: String!): Boolean!

    # Search users
    searchUsers(query: String!): [User!]!
  }

  # *****************************
  # Mutations
  # *****************************
  extend type Mutation {
    # Register User
    signUp(input: SignUpInput!): User!

    # Confirm registration
    confirmResend(email: String!): Boolean!

    # Log in User
    login(input: LoginInput!): Token!

    # Request Password reset by email
    resetPasswordRequest(email: String!): Boolean!

    # Change the password by email link
    verifyResetPasswordRequest(token: String!, password: String!): Token!
  }
`;

export default UserSchema;
