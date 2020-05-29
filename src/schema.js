const { gql } = require('apollo-server');

const typeDefs = gql`
  type Query {
    getPokemons: [Pokemon]
    getRaids: [Raid]
  }

  type Pokemon {
    pokemonId: String!
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
`;

module.exports = typeDefs;
