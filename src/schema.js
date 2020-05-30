const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type Query {
    getPokemons: [Pokemon]
    getPokemonById(id: ID): Pokemon
    getPokemonByName(name: String): Pokemon
    getRaids: [Raid]
    getRaidTier(tier: Int): Raid
    getEvents: [Event]!
    getEvent(id: ID!): Event!
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
    name: String!
    desc: String!
    start: String!
    end: String!
    img: String!
  }
`;

module.exports = typeDefs;
