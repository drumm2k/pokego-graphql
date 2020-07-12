// var pokemons = require('../lib/pokemon.json');
// var raidsData = require('../lib/raids.json');

import userResolver from './user';
import followResolver from './follow';
import pokemonResolver from './pokemon';
import raidResolver from './raid';
import tradeListResolver from './tradeList';
import eventResolver from './event';

export default [
  userResolver,
  followResolver,
  pokemonResolver,
  raidResolver,
  tradeListResolver,
  eventResolver,
];
