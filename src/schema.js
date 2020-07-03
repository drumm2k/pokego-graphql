const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    getUser(userName: String!): User
    getUsers: [User!]!
    getTradeLists: [TradeList!]!
    getPkmns: [Pkmn!]!
    getPokemons: [Pokemon!]!
    getPokemonsPure: [Pokemon!]!
    getPokemonById(id: ID): Pokemon
    getPokemonByName(name: String): Pokemon
    getPokemonGroupByName(names: [String]): [Pokemon!]!
    getRaids: [Raid!]!
    getRaidTier(tier: Int): Raid
    getRaidTiers: [Raid!]!
    getRaidsFull: RaidsFull
    getEvents: [Event!]!
    getEvent(id: ID!): Event
  }

  type Mutation {
    createUser(input: UserInput!): User
    createTradeList(input: TradeListInput!): TradeList
    createFollow(input: CreateFollowInput!): Follow
    deleteFollow(input: DeleteFollowInput!): Follow
    createPkmn(input: PkmnInput!): Pkmn
    initPkmn: [Pkmn]
  }

  type User {
    id: ID!
    userName: String!
    email: String!
    password: String
    trainerTeam: String
    trainerCode: String
    trainerLevel: Int
    locLatitude: Float
    locLongtitude: Float
    telegram: String
    followers: [Follow]
    following: [Follow]
    tradeLists: [TradeList!]!
    isBanned: Boolean
    isOnline: Boolean
    createdAt: String!
    updatedAt: String!
  }

  input UserInput {
    userName: String!
    email: String!
    password: String!
    trainerTeam: String
    trainerCode: String
    trainerLevel: Int
    locLatitude: Float
    locLongtitude: Float
    telegram: String
  }

  type Follow {
    id: ID!
    user: ID
    follower: ID
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
    pokemons: [String]!
    description: String!
    isPrivate: Boolean
    createdBy: User!
  }

  input TradeListInput {
    pokemons: [String]!
    description: String!
    isPrivate: Boolean
  }

  type RaidsFull {
    raids: [Raid]
    pokemons: [Pokemon]
  }

  type Pkmn {
    id: ID!
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
    thirdMoveStardust: Int
    thirdMoveCandy: Int
  }

  input PkmnInput {
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
    thirdMoveStardust: Int
    thirdMoveCandy: Int
  }

  type EvolutionBranch {
    evolution: String!
    candyCost: Int!
    form: String!
  }

  type Pokemon {
    pokemonId: ID!
    type: String
    type2: String
    stats: Stats
    quickMoves: [String]
    cinematicMoves: [String]
    pokedexHeightM: Float
    pokedexWeightKg: Float
    heightStdDev: Float
    weightStdDev: Float
    familyId: String
    candyToEvolve: Int
    thirdMove: ThirdMove
    movesets: [Movesets]
    pokedex: Pokedex
    tmMovesets: [TmMovesets]
    currentMovesets: [CurrentMovesets]
  }

  type Stats {
    baseStamina: Int
    baseAttack: Int
    baseDefense: Int
  }

  type ThirdMove {
    stardustToUnlock: Int
    candyToUnlock: Int
  }

  type Movesets {
    quickMove: String
    cinematicMove: String
  }

  type Pokedex {
    pokemonId: String
    pokemonNum: ID!
    gen: String
  }

  type TmMovesets {
    quickMove: String
    cinematicMove: String
  }

  type CurrentMovesets {
    quickMove: String
    cinematicMove: String
  }

  type Raid {
    tier: String
    info: Info
    raids: [Raids]
    attackMultiplier: Float
    defenseMultiplier: Float
    staminaMultiplier: Float
    raidType: String
  }

  type Info {
    hp: Int
    cpm: Float
    level: Int
    guessTier: String
    attackMultiplier: Float
    defenseMultiplier: Float
    staminaMultiplier: Float
  }

  type Raids {
    id: Int
    pokemon: String
    cp: Int
    shiny: Boolean
    verified: Boolean
    minCp: Int
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
