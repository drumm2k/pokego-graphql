// var pokemons = require('../lib/pokemon.json');
// var raidsData = require('../lib/raids.json');
var events = require('../lib/events.json');
var pkmns = require('../lib/pokemons.json');

import fetch from 'node-fetch';
import bcrypt from 'bcryptjs';

import User from './models/user';
import Follow from './models/follow';
import TradeList from './models/tradeList';
import Pokemon from './models/pokemon';
import Raid from './models/raid';

const user = async (userId) => {
  try {
    const user = await User.findById(userId);
    return {
      ...user._doc,
      id: user.id,
      password: null,
      tradeLists: tradeLists.bind(this, user.tradeLists),
      followers: followers.bind(this, user._doc.followers),
      following: following.bind(this, user._doc.following),
      createdAt: new Date(user._doc.createdAt).toISOString(),
      updatedAt: new Date(user._doc.updatedAt).toISOString(),
    };
  } catch (error) {
    throw error;
  }
};

const pokemon = async (pokemonId) => {
  try {
    const pokemons = await Pokemon.find({ _id: { $in: pokemonId } });
    return pokemons.map((pokemon) => {
      return {
        ...pokemon._doc,
        id: pokemon.id,
      };
    });
  } catch (error) {
    throw error;
  }
};

const transformTradeList = (tradeList) => {
  return {
    ...tradeList._doc,
    id: tradeList.id,
    pokemons: pokemon.bind(this, tradeList.pokemons),
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
        user: user.bind(this, follower.user),
        follower: user.bind(this, follower.follower),
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
        user: user.bind(this, followingUser.user),
        follower: user.bind(this, followingUser.follower),
      };
    });
  } catch (error) {
    throw error;
  }
};

const raidPokemon = async (raid) => {
  try {
    const pokemonName = raid.pokemon.replace('_FORM', '');
    const pokemon = await Pokemon.findOne({ name: pokemonName });

    return {
      pokemon: pokemon._id,
      cp: raid.cp,
      shiny: raid.shiny,
      verified: raid.verified,
    };
  } catch (error) {
    throw error;
  }
};

module.exports = {
  Query: {
    getUser: async (parent, args, context, info) => {
      try {
        const user = await User.findOne({ userName: args.userName });
        return {
          ...user._doc,
          id: user.id,
          password: null,
          tradeLists: tradeLists.bind(this, user.tradeLists),
          followers: followers.bind(this, user._doc.followers),
          following: following.bind(this, user._doc.following),
          createdAt: new Date(user._doc.createdAt).toISOString(),
          updatedAt: new Date(user._doc.updatedAt).toISOString(),
        };
      } catch (error) {
        throw error;
      }
    },
    getUsers: async () => {
      try {
        const users = await User.find();
        const res = users.map((user) => {
          return {
            ...user._doc,
            id: user.id,
            password: null,
            tradeLists: tradeLists.bind(this, user.tradeLists),
            followers: followers.bind(this, user._doc.followers),
            following: following.bind(this, user._doc.following),
            createdAt: new Date(user._doc.createdAt).toISOString(),
            updatedAt: new Date(user._doc.updatedAt).toISOString(),
          };
        });
        return res;
      } catch (error) {
        throw error;
      }
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
    getRaids: async () => {
      try {
        const raids = await Raid.find()
          .sort({ tier: 1 })
          .populate({ path: 'raids', populate: { path: 'pokemon' } });

        return raids.map(async (tier) => {
          return {
            ...tier._doc,
            id: tier.id,
          };
        });
      } catch (error) {
        throw error;
      }
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
          trainer: args.input.trainer,
          location: args.input.location,
          telegram: args.input.telegram,
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
        const createdBy = await User.findById('5f07d864237fa2330e36290f');
        if (!createdBy) {
          throw new Error('User not found.');
        }

        const tradeList = new TradeList({
          pokemons: args.input.pokemons,
          description: args.input.description,
          isPrivate: args.input.isPrivate,
          createdBy: '5f07d864237fa2330e36290f',
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
    createPokemon: async (parent, args, context, info) => {
      try {
        const pokemon = new Pokemon({
          templateId: args.input.templateId,
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
    initRaids: async () => {
      try {
        const raids = await fetch('https://fight.pokebattler.com/raids');
        const raidsData = await raids.json();

        // Filter raids level 1-5
        const levels = [1, 2, 3, 4, 5];
        const raidList = levels.map((level) =>
          raidsData.tiers.find((raid) => raid.tier === `RAID_LEVEL_${level}`)
        );

        return raidList.map(async (tier) => {
          const raidResult = tier.raids.map((raid) => {
            return raidPokemon(raid);
          });

          const raid = new Raid({
            tier: tier.tier,
            raids: await Promise.all(raidResult),
          });

          raid.save();

          return { ...raid._doc, id: raid.id };
        });
      } catch (error) {
        throw error;
      }
    },
  },
};
