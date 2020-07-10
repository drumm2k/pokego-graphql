const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    getUser(userName: String!): User!
    getUsers: [User!]!
    getTradeLists: [TradeList!]!
    getPokemons: [Pokemon!]!
    getPokemonByName(name: String!): Pokemon!
    getRaids: [Tier!]!
    getEvents: [Event!]!
    getEvent(id: ID!): Event!
  }

  type Mutation {
    createUser(input: UserInput!): User
    createTradeList(input: TradeListInput!): TradeList
    createFollow(input: CreateFollowInput!): Follow
    deleteFollow(input: DeleteFollowInput!): Follow
    createPokemon(input: PokemonInput!): Pokemon
    initPokemons: [Pokemon]
    initRaids: [Tier]
  }

  type User {
    id: ID!
    userName: String!
    email: String!
    password: String
    trainer: Trainer
    location: Location
    telegram: String
    followers: [Follow]!
    following: [Follow]!
    tradeLists: [TradeList]!
    isBanned: Boolean
    isOnline: Boolean
    createdAt: String!
    updatedAt: String
  }

  input UserInput {
    userName: String!
    email: String!
    password: String!
    trainer: TrainerInput
    location: LocationInput
    telegram: String
  }

  type Trainer {
    team: String
    level: Int
    code: String
  }

  input TrainerInput {
    team: String
    level: Int
    code: String
  }

  type Location {
    latitude: Float
    longtitude: Float
  }

  input LocationInput {
    latitude: Float
    longtitude: Float
  }

  type Follow {
    id: ID!
    user: User
    follower: User
  }

  input CreateFollowInput {
    userId: ID!
    followerId: ID!
  }

  input DeleteFollowInput {
    id: ID!
  }

  type TradeList {
    id: ID!
    pokemons: [Pokemon]!
    description: String!
    isPrivate: Boolean
    createdBy: User!
  }

  input TradeListInput {
    pokemons: [ID!]!
    description: String
    isPrivate: Boolean
  }

  type Pokemon {
    id: ID!
    templateId: String!
    name: String!
    pokedex: Int!
    gen: String!
    shiny: Boolean!
    released: Boolean!
    type1: String!
    type2: String
    baseStamina: Int!
    baseAttack: Int!
    baseDefense: Int!
    quickMoves: [String!]!
    cinematicMoves: [String!]!
    pokemonClass: String
    parentId: String
    familyId: String
    kmBuddyDistance: Int
    evolutionBranch: [EvolutionBranch]!
    thirdMoveStardust: Int
    thirdMoveCandy: Int
  }

  input PokemonInput {
    templateId: String!
    name: String!
    pokedex: Int!
    gen: String!
    shiny: Boolean!
    released: Boolean!
    type1: String!
    type2: String
    baseStamina: Int!
    baseAttack: Int!
    baseDefense: Int!
    quickMoves: [String!]!
    cinematicMoves: [String!]!
    pokemonClass: String
    parentId: String
    familyId: String
    kmBuddyDistance: Int
    evolutionBranch: [EvolutionBranchInput]
    thirdMoveStardust: Int
    thirdMoveCandy: Int
  }

  type EvolutionBranch {
    evolution: String
    evolutionItemRequirement: String
    lureItemRequirement: String
    candyCost: Int
    form: String
  }

  input EvolutionBranchInput {
    evolution: String
    evolutionItemRequirement: String
    lureItemRequirement: String
    candyCost: Int
    form: String
  }

  type Tier {
    id: ID!
    tier: String
    raids: [Raid]
  }

  type Raid {
    id: ID!
    pokemon: Pokemon
    cp: Int
    shiny: Boolean
    verified: Boolean
  }

  type Event {
    id: ID!
    name: String
    img: String
    imgFull: String
    description: String
    descriptionFull: String
    starts: String
    ends: String
  }
`;

module.exports = typeDefs;
