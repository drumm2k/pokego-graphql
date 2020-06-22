var pokemons = require('../lib/pokemon.json');
var raids = require('../lib/raids.json');
var events = require('../lib/events.json');
import bcrypt from 'bcryptjs';

import User from './models/user';
import TradeList from './models/tradeList';

// createdAt: new Date(user._doc.createdAt).toISOString(),

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      id: user.id,
      password: null,
      tradeLists: tradeLists.bind(this, user.tradeLists),
    };
  } catch (error) {
    throw error;
  }
};

const tradeLists = async (tradeListsIds) => {
  try {
    const tradeLists = await TradeList.find({ _id: { $in: tradeListsIds } });
    return tradeLists.map((tradeList) => {
      return {
        ...tradeList._doc,
        id: tradeList.id,
        createdBy: user.bind(this, tradeList.createdBy),
      };
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  Query: {
    getUsers: async () => {
      return User.find()
        .then((users) => {
          return users.map((user) => {
            return {
              ...user._doc,
              password: null,
              id: user.id,
              tradeLists: tradeLists.bind(this, user._doc.tradeLists),
            };
          });
        })
        .catch((error) => {
          throw error;
        });
    },
    getTradeLists: async () => {
      try {
        const tradeLists = await TradeList.find();

        return tradeLists.map((tradeList) => {
          return {
            ...tradeList._doc,
            id: tradeList.id,
            createdBy: user.bind(this, tradeList._doc.createdBy),
          };
        });
      } catch (error) {
        throw error;
      }
    },
    getPokemons: () => pokemons.pokemon,
    getPokemonsPure: () => {
      let res = [];
      pokemons.pokemon.map((pokemon) => {
        if (!pokemon.pokemonId.includes('FORM')) res.push(pokemon);
      });

      return res;
    },
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
      // console.log(res);
      return res;
    },
    getRaidsFull() {
      const levels = [1, 2, 3, 4, 5];

      // Filter raids level 1-5
      const raidList = levels.map((level) =>
        raids.tiers.find((raid) => raid.tier === `RAID_LEVEL_${level}`)
      );

      // Get pokemon names
      const pokemonList = raidList.map((tier) =>
        tier.raids.map((pokemon) => pokemon.pokemon)
      );

      // Find pokemons with the same name and get the data
      const pokemonsData = [];
      pokemonList.map((tier) =>
        tier.map((name) =>
          pokemons.pokemon.find((pokemon) => {
            if (pokemon.pokemonId === name) pokemonsData.push(pokemon);
          })
        )
      );

      let res = {};
      res['raids'] = raidList;
      res['pokemons'] = pokemonsData;

      return res;
    },
    getEvents(parent, args, context, info) {
      return events.events;
    },
    getEvent(obj, args, context, info) {
      return events.events.find((event) => event.id === parseInt(args.id));
    },
  },
  Mutation: {
    createUser: async (parent, args, context, info) => {
      try {
        const existingUser = await User.findOne({ email: args.userInput.email });

        if (existingUser) {
          throw new Error('User already exists.');
        }
        const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

        const user = new User({
          userName: args.userInput.userName,
          email: args.userInput.email,
          password: hashedPassword,
          team: args.userInput.team,
        });

        const result = await user.save();
        return { ...result._doc, password: null, id: user.id };
      } catch (error) {
        throw error;
      }
    },
    createTradeList: async (parent, args, context, info) => {
      try {
        const tradeList = new TradeList({
          pokemons: args.tradeListInput.pokemons,
          description: args.tradeListInput.description,
          isPrivate: args.tradeListInput.isPrivate,
          createdBy: '5ef00af4166c4d48939750b6',
        });

        const createdBy = await User.findById('5ef00af4166c4d48939750b6');
        if (!createdBy) {
          throw new Error('User not found.');
        }

        const result = await tradeList.save();
        const createdTradeList = {
          ...result._doc,
          id: tradeList.id,
          createdBy: user.bind(this, result._doc.createdBy),
        };
        createdBy.tradeLists.push(tradeList);
        await createdBy.save();

        return createdTradeList;
      } catch (error) {
        throw error;
      }
    },
  },
};
