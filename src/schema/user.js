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
    subscription: Boolean!
    roles: [String]!
    banned: Boolean
    online: Boolean
    trainer: Trainer
    location: Location
    social: Social
    tradeLists: [TradeList]!
    createdAt: String!
    updatedAt: String!
  }

  type Social {
    telegram: String
    discord: String
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
    accessToken: String!
    user: User
  }

  # *****************************
  # Input Objects
  # *****************************
  input SignUpInput {
    userName: String!
    email: String!
    password: String!
    subscription: Boolean!
    social: SocialInput
    trainer: TrainerInput!
    location: LocationInput
  }

  input SocialInput {
    telegram: String
    discord: String
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

    hello: String!
  }

  # *****************************
  # Mutations
  # *****************************
  extend type Mutation {
    # Register User
    signUp(input: SignUpInput!): Boolean!

    # Confirm registration
    confirmResend(email: String!): Boolean!

    # Log in User
    login(input: LoginInput!): Token!

    # Log out
    logout: Boolean!

    # Request Password reset by email
    resetPasswordRequest(email: String!): Boolean!

    # Change the password by email link
    verifyResetPasswordRequest(token: String!, password: String!): Token!
  }
`;

export default UserSchema;
