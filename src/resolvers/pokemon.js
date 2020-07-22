const pkmns = require('../../lib/pokemons.json');

const pokemonResolver = {
  Query: {
    getPokemons: async (_parent, _args, { models }) => {
      try {
        const pokemons = await models.Pokemon.find().sort({ gen: 1, pokedex: 1 });
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
    getPokemonByName: async (_parent, { name }, { models }) => {
      const nameUpperCase = name.toUpperCase();
      try {
        const pokemon = await models.Pokemon.findOne({ name: nameUpperCase });

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
    createPokemon: async (_parent, { input }, { models, user }) => {
      if (!user || !user.roles.includes('admin')) {
        throw new Error('Unathorized');
      }
      try {
        return await models.Pokemon.create({
          templateId: input.templateId,
          name: input.name,
          pokedex: input.pokedex,
          gen: input.gen,
          shiny: input.shiny,
          released: input.released,
          tradable: input.tradable,
          type1: input.type1,
          type2: input.type2,
          baseStamina: input.baseStamina,
          baseAttack: input.baseAttack,
          baseDefense: input.baseDefense,
          quickMoves: input.quickMoves,
          cinematicMoves: input.cinematicMoves,
          pokemonClass: input.pokemonClass,
          parentId: input.parentId,
          familyId: input.familyId,
          kmBuddyDistance: input.kmBuddyDistance,
          evolutionBranch: input.evolutionBranch,
          thirdMoveStardust: input.thirdMoveStardust,
          thirdMoveCandy: input.thirdMoveCandy,
        });
      } catch (error) {
        throw error;
      }
    },
    initPokemons: async (_parent, _args, { models, user }) => {
      if (!user || !user.roles.includes('admin')) {
        throw new Error('Unathorized');
      }
      try {
        await pkmns.pokemons.map(async (pokemon) => {
          return await models.Pokemon.create({
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
        });
        await pkmns.pokemons_alola.map(async (pokemon) => {
          return await models.Pokemon.create({
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
        });
        await pkmns.pokemons_galarian.map(async (pokemon) => {
          return await models.Pokemon.create({
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
        });
      } catch (error) {
        throw error;
      }
    },
  },
};

export default pokemonResolver;
