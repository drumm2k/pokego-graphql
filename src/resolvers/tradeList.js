import { transformTradeList } from './merge';

const tradeListResolver = {
  Query: {
    getTradeLists: async (_parent, _args, { models }) => {
      const tradeLists = await models.TradeList.find();

      return tradeLists.map((list) => {
        return transformTradeList(list);
      });
    },
  },
  Mutation: {
    createTradeList: async (_parent, { input }, { user, models }) => {
      if (!user) {
        throw new Error('Unauthenticated');
      }

      const createdBy = await models.User.findById(user.id);
      if (!createdBy) {
        throw new Error('User not found');
      }

      const tradeList = await models.TradeList.create({
        pokemons: input.pokemons,
        description: input.description,
        isPrivate: input.isPrivate,
        createdBy: user.id,
      });

      createdBy.tradeLists.push(tradeList);
      await createdBy.save();

      return transformTradeList(tradeList);
    },
  },
};

export default tradeListResolver;
