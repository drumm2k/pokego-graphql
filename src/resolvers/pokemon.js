import Pokemon from '../models/pokemon';
const pkmns = require('../../lib/pokemons.json');

const pokemonResolver = {
  Query: {
    getPokemons: async () => {
      try {
        const pokemons = await Pokemon.find().sort({ gen: 1, pokedex: 1 });

        return pokemons.map((pokemon) => {
          return {
            ...pokemon._doc,
            id: pokemon.id,
          };
        });
      } catch (error) {
        throw error;
      }
    },
    getPokemonByName: async (parent, args, context, info) => {
      try {
        const pokemon = await Pokemon.findOne({ name: args.name });
        return {
          ...pokemon._doc,
          id: pokemon.id,
        };
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    createPokemon: async (parent, args, context, info) => {
      try {
        const pokemon = new Pokemon({
          templateId: args.input.templateId,
          name: args.input.name,
          pokedex: args.input.pokedex,
          gen: args.input.gen,
          shiny: args.input.shiny,
          released: args.input.released,
          tradable: args.input.tradable,
          type1: args.input.type1,
          type2: args.input.type2,
          baseStamina: args.input.baseStamina,
          baseAttack: args.input.baseAttack,
          baseDefense: args.input.baseDefense,
          quickMoves: args.input.quickMoves,
          cinematicMoves: args.input.cinematicMoves,
          pokemonClass: args.input.pokemonClass,
          parentId: args.input.parentId,
          familyId: args.input.familyId,
          kmBuddyDistance: args.input.kmBuddyDistance,
          evolutionBranch: args.evolutionBranch,
          thirdMoveStardust: args.input.thirdMoveStardust,
          thirdMoveCandy: args.input.thirdMoveCandy,
        });

        await pokemon.save();
        return pokemon;
      } catch (error) {
        throw error;
      }
    },
    initPokemons: async () => {
      await pkmns.pokemons.map((pokemon) => {
        const poke = new Pokemon({
          templateId: pokemon.templateId,
          name: pokemon.name,
          pokedex: pokemon.pokedex,
          gen: pokemon.gen,
          shiny: pokemon.shiny,
          released: pokemon.released,
          tradable: pokemon.tradable,
          type1: pokemon.type1,
          type2: pokemon.type2,
          baseStamina: pokemon.baseStamina,
          baseAttack: pokemon.baseAttack,
          baseDefense: pokemon.baseDefense,
          quickMoves: pokemon.quickMoves,
          cinematicMoves: pokemon.cinematicMoves,
          pokemonClass: pokemon.pokemonClass,
          parentId: pokemon.parentId,
          familyId: pokemon.familyId,
          kmBuddyDistance: pokemon.kmBuddyDistance,
          evolutionBranch: pokemon.evolutionBranch,
          thirdMoveStardust: pokemon.thirdMoveStardust,
          thirdMoveCandy: pokemon.thirdMoveCandy,
        });
        poke.save();

        return poke;
      });
      await pkmns.pokemons_alola.map((pokemon) => {
        const poke = new Pokemon({
          templateId: pokemon.templateId,
          name: pokemon.name,
          pokedex: pokemon.pokedex,
          gen: pokemon.gen,
          shiny: pokemon.shiny,
          released: pokemon.released,
          tradable: pokemon.tradable,
          type1: pokemon.type1,
          type2: pokemon.type2,
          baseStamina: pokemon.baseStamina,
          baseAttack: pokemon.baseAttack,
          baseDefense: pokemon.baseDefense,
          quickMoves: pokemon.quickMoves,
          cinematicMoves: pokemon.cinematicMoves,
          pokemonClass: pokemon.pokemonClass,
          parentId: pokemon.parentId,
          familyId: pokemon.familyId,
          kmBuddyDistance: pokemon.kmBuddyDistance,
          evolutionBranch: pokemon.evolutionBranch,
          thirdMoveStardust: pokemon.thirdMoveStardust,
          thirdMoveCandy: pokemon.thirdMoveCandy,
        });
        poke.save();

        return poke;
      });
      await pkmns.pokemons_galarian.map((pokemon) => {
        const poke = new Pokemon({
          templateId: pokemon.templateId,
          name: pokemon.name,
          pokedex: pokemon.pokedex,
          gen: pokemon.gen,
          shiny: pokemon.shiny,
          released: pokemon.released,
          tradable: pokemon.tradable,
          type1: pokemon.type1,
          type2: pokemon.type2,
          baseStamina: pokemon.baseStamina,
          baseAttack: pokemon.baseAttack,
          baseDefense: pokemon.baseDefense,
          quickMoves: pokemon.quickMoves,
          cinematicMoves: pokemon.cinematicMoves,
          pokemonClass: pokemon.pokemonClass,
          parentId: pokemon.parentId,
          familyId: pokemon.familyId,
          kmBuddyDistance: pokemon.kmBuddyDistance,
          evolutionBranch: pokemon.evolutionBranch,
          thirdMoveStardust: pokemon.thirdMoveStardust,
          thirdMoveCandy: pokemon.thirdMoveCandy,
        });
        poke.save();

        return poke;
      });
    },
  },
};

export default pokemonResolver;
