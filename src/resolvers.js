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
    getRaids: () => raids.tiers,
    getRaidTier(parent, args, context, info) {
      return raids.tiers.find((raid) => raid.tier === `RAID_LEVEL_${args.tier}`);
    },
    getEvents(parent, args, context, info) {
      return events.events;
    },
    getEvent(obj, args, context, info) {
      return events.events.find((event) => event.id === parseInt(args.id));
    },
  },
};
