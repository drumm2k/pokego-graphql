import { gql } from 'apollo-server-express';

const RaidSchema = gql`
  # *****************************
  # Type Objects
  # *****************************
  type Tier {
    id: ID!
    tier: String!
    raids: [Raid!]!
  }

  type Raid {
    id: ID!
    pokemon: Pokemon!
    cp: Int!
    shiny: Boolean!
    verified: Boolean!
  }
  # *****************************
  # Input Objects
  # *****************************

  # *****************************
  # Queries
  # *****************************
  extend type Query {
    # Get all Raids
    getRaids: [Tier!]!
  }

  # *****************************
  # Mutations
  # *****************************
  extend type Mutation {
    # Initialize Raids in DB
    initRaids: [Tier]
  }
`;

export default RaidSchema;
