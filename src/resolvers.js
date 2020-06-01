var pokemons = require('../lib/pokemon.json');
var raids = require('../lib/raids.json');
var events = require('../lib/events.json');

module.exports = {
  Query: {
    getPokemons: () => pokemons.pokemon,
    getPokemonById(parent, args, context, info) {
      return pokemons.pokemon.find(
        (pokemon) => pokemon.pokedex.pokemonNum === parseInt(args.id)
      );
    },
    getPokemonByName(parent, args, context, info) {
      return pokemons.pokemon.find((pokemon) => pokemon.pokemonId === args.name);
    },
    getPokemonGroupByName(parent, args, context, info) {
      const res = args.names.map((name) =>
        pokemons.pokemon.find((pokemon) => pokemon.pokemonId === name)
      );

      return res;
    },
    getRaids: () => raids.tiers,
    getRaidTier(parent, args, context, info) {
      return raids.tiers.find((raid) => raid.tier === `RAID_LEVEL_${args.tier}`);
    },
    getRaidTiers() {
      const levels = [1, 2, 3, 4, 5];

      const res = levels.map((level) =>
        raids.tiers.find((raid) => raid.tier === `RAID_LEVEL_${level}`)
      );

      return res;
    },
    getEvents(parent, args, context, info) {
      return events.events;
    },
    getEvent(obj, args, context, info) {
      return events.events.find((event) => event.id === parseInt(args.id));
    },
  },
};
