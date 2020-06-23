var pokemons = require('../lib/pokemon.json');
var raids = require('../lib/raids.json');
var events = require('../lib/events.json');
var pkmns = require('../lib/pokemons.json');

import bcrypt from 'bcryptjs';

import User from './models/user';
import Follow from './models/follow';
import TradeList from './models/tradeList';
import Pkmn from './models/pokemon';

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      id: user.id,
      password: null,
      tradeLists: tradeLists.bind(this, user.tradeLists),
      createdAt: new Date(user._doc.createdAt).toISOString(),
      updatedAt: new Date(user._doc.updatedAt).toISOString(),
    };
  } catch (error) {
    throw error;
  }
};

const transformTradeList = (tradeList) => {
  return {
    ...tradeList._doc,
    id: tradeList.id,
    createdBy: user.bind(this, tradeList.createdBy),
  };
};

const tradeLists = async (tradeListsIds) => {
  try {
    const tradeLists = await TradeList.find({ _id: { $in: tradeListsIds } });
    return tradeLists.map((tradeList) => {
      return transformTradeList(tradeList);
    });
  } catch (error) {
    throw error;
  }
};

const followers = async (followersIds) => {
  try {
    const followers = await Follow.find({ _id: { $in: followersIds } });
    return followers.map((follower) => {
      return {
        ...follower._doc,
        id: follower.id,
      };
    });
  } catch (error) {
    throw error;
  }
};

const following = async (followingIds) => {
  try {
    const following = await Follow.find({ _id: { $in: followingIds } });
    return following.map((followingUser) => {
      return {
        ...followingUser._doc,
        id: followingUser.id,
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
              followers: followers.bind(this, user._doc.followers),
              following: following.bind(this, user._doc.following),
              createdAt: new Date(user._doc.createdAt).toISOString(),
              updatedAt: new Date(user._doc.updatedAt).toISOString(),
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
          return transformTradeList(tradeList);
        });
      } catch (error) {
        throw error;
      }
    },
    getPkmns: async () => {
      try {
        const pkmns = await Pkmn.find().sort({ gen: 1, pokedex: 1 });

        return pkmns.map((pkmn) => {
          return {
            ...pkmn._doc,
            id: pkmn.id,
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
        const existingUser = await User.findOne({ email: args.input.email });

        if (existingUser) {
          throw new Error('User already exists.');
        }
        const hashedPassword = await bcrypt.hash(args.input.password, 12);

        const user = new User({
          userName: args.input.userName,
          email: args.input.email,
          password: hashedPassword,
          team: args.input.team,
          trainerCode: args.input.trainerCode,
          latitude: args.input.latitude,
          longtitude: args.input.longtitude,
        });

        const result = await user.save();
        return { ...result._doc, password: null, id: user.id };
      } catch (error) {
        throw error;
      }
    },
    createFollow: async (
      parent,
      { input: { userId, followerId } },
      context,
      info
    ) => {
      try {
        // Need to add check if the follower is the authorized user and this follow is connected to him
        // Check if already following?
        const follow = await new Follow({
          user: userId,
          follower: followerId,
        }).save();

        // Push follower/following to user collection
        await User.findOneAndUpdate(
          { _id: userId },
          { $push: { followers: follow.id } }
        );
        await User.findOneAndUpdate(
          { _id: followerId },
          { $push: { following: follow.id } }
        );

        return follow;
      } catch (error) {
        throw error;
      }
    },
    deleteFollow: async (parent, { input: { id } }) => {
      try {
        // Need to add check if the follower is the authorized user and this follow was created by him
        const follow = await Follow.findByIdAndRemove(id);

        // Delete follow from users collection
        await User.findOneAndUpdate(
          { _id: follow.user },
          { $pull: { followers: follow.id } }
        );
        await User.findOneAndUpdate(
          { _id: follow.follower },
          { $pull: { following: follow.id } }
        );

        return follow;
      } catch (error) {
        throw error;
      }
    },
    createTradeList: async (parent, args, context, info) => {
      try {
        const createdBy = await User.findById('5ef00af4166c4d48939750b6');
        if (!createdBy) {
          throw new Error('User not found.');
        }

        const tradeList = new TradeList({
          pokemons: args.input.pokemons,
          description: args.input.description,
          isPrivate: args.input.isPrivate,
          createdBy: '5ef00af4166c4d48939750b6',
        });
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
    createPkmn: async (parent, args, context, info) => {
      try {
        const pkmn = new Pkmn({
          name: args.input.name,
          pokedex: args.input.pokedex,
          gen: args.input.gen,
          shiny: args.input.shiny,
          released: args.input.released,
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
          thirdMoveStardust: args.input.thirdMoveStardust,
          thirdMoveCandy: args.input.thirdMoveCandy,
        });

        await pkmn.save();
        return pkmn;
      } catch (error) {
        throw error;
      }
    },
    initPkmn: async () => {
      await pkmns.pokemons.map((pokemon) => {
        const pkmn = new Pkmn({
          name: pokemon.name,
          pokedex: pokemon.pokedex,
          gen: pokemon.gen,
          shiny: pokemon.shiny,
          released: pokemon.released,
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
          thirdMoveStardust: pokemon.thirdMoveStardust,
          thirdMoveCandy: pokemon.thirdMoveCandy,
        });
        pkmn.save();

        return pkmn;
      });
      await pkmns.pokemons_alola.map((pokemon) => {
        const pkmn = new Pkmn({
          name: pokemon.name,
          pokedex: pokemon.pokedex,
          gen: pokemon.gen,
          shiny: pokemon.shiny,
          released: pokemon.released,
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
          thirdMoveStardust: pokemon.thirdMoveStardust,
          thirdMoveCandy: pokemon.thirdMoveCandy,
        });
        pkmn.save();

        return pkmn;
      });
      await pkmns.pokemons_galarian.map((pokemon) => {
        const pkmn = new Pkmn({
          name: pokemon.name,
          pokedex: pokemon.pokedex,
          gen: pokemon.gen,
          shiny: pokemon.shiny,
          released: pokemon.released,
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
          thirdMoveStardust: pokemon.thirdMoveStardust,
          thirdMoveCandy: pokemon.thirdMoveCandy,
        });
        pkmn.save();

        return pkmn;
      });
    },
  },
};
