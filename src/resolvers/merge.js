import dateToString from '../../helpers/date';
import User from '../models/user';
import Pokemon from '../models/pokemon';
import Follow from '../models/follow';
import TradeList from '../models/tradeList';

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
      createdAt: dateToString(user._doc.createdAt),
      updatedAt: dateToString(user._doc.updatedAt),
    };
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

export { user, followers, following, pokemon, transformTradeList, tradeLists };
