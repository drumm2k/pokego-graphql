var pokemons = require('../lib/pokemon.json');

module.exports = {
  Query: {
    getPokemons: () => pokemons.pokemon,
  },
};
