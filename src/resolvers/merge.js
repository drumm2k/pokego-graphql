import dateToString from '../../helpers/date';
import models from '../models';

const user = async (userId) => {
  try {
    const user = await models.User.findById(userId);
    return {
      ...user._doc,
      id: user.id,
      password: null,
      tradeLists: tradeLists.bind(this, user.tradeLists),
      createdAt: dateToString(user._doc.createdAt),
      updatedAt: dateToString(user._doc.updatedAt),
    };
  } catch (error) {
    throw error;
  }
};

const pokemon = async (pokemonId) => {
  try {
    const pokemons = await models.Pokemon.find({ _id: { $in: pokemonId } });
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
    const tradeLists = await models.TradeList.find({ _id: { $in: tradeListsIds } });
    return tradeLists.map((tradeList) => {
      return transformTradeList(tradeList);
    });
  } catch (error) {
    throw error;
  }
};

export { user, pokemon, transformTradeList, tradeLists };
