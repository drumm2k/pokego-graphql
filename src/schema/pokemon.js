import { gql } from 'apollo-server-express';

const PokemonSchema = gql`
  # *****************************
  # Type Objects
  # *****************************
  type Pokemon {
    id: ID!
    templateId: String!
    name: String!
    pokedex: Int!
    gen: String!
    shiny: Boolean!
    released: Boolean!
    tradable: Boolean!
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

  type EvolutionBranch {
    evolution: String
    evolutionItemRequirement: String
    lureItemRequirement: String
    candyCost: Int
    form: String
  }

  # *****************************
  # Input Objects
  # *****************************
  input PokemonInput {
    templateId: String!
    name: String!
    pokedex: Int!
    gen: String!
    shiny: Boolean!
    released: Boolean!
    tradable: Boolean!
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

  input EvolutionBranchInput {
    evolution: String
    evolutionItemRequirement: String
    lureItemRequirement: String
    candyCost: Int
    form: String
  }

  # *****************************
  # Queries
  # *****************************
  extend type Query {
    # Get all Pokemons
    getPokemons: [Pokemon!]!

    # Get Pokemon by Name
    getPokemonByName(name: String!): Pokemon!
  }

  # *****************************
  # Mutations
  # *****************************
  extend type Mutation {
    # Create Pokemon
    createPokemon(input: PokemonInput!): Pokemon

    # Initialize Pokemons in DB from /lib/pokemons.json
    initPokemons: [Pokemon]
  }
`;

export default PokemonSchema;
