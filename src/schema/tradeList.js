import { gql } from 'apollo-server-express';

const TradeListSchema = gql`
  # *****************************
  # Type Objects
  # *****************************
  type TradeList {
    id: ID!
    pokemons: [Pokemon]!
    description: String!
    isPrivate: Boolean
    createdBy: User!
  }

  # *****************************
  # Input Objects
  # *****************************
  input TradeListInput {
    pokemons: [ID!]!
    description: String
    isPrivate: Boolean
  }

  # *****************************
  # Queries
  # *****************************
  extend type Query {
    # Get all TradeLists
    getTradeLists: [TradeList!]!
  }
  # *****************************
  # Mutations
  # *****************************
  extend type Mutation {
    # Create TradeList
    createTradeList(input: TradeListInput!): TradeList
  }
`;

export default TradeListSchema;
