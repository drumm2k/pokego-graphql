var pokemons = require('../lib/pokemon.json');
var raids = require('../lib/raids.json');

module.exports = {
  Query: {
    getPokemons: () => pokemons.pokemon,
    getRaids: () => raids.tiers,
  },
};
