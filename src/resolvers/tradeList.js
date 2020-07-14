import TradeList from '../models/tradeList';
import User from '../models/user';
import { transformTradeList } from './merge';

const tradeListResolver = {
  Query: {
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
  },
  Mutation: {
    createTradeList: async (parent, args, context, info) => {
      if (!context.user) {
        throw new Error('Unathenticated');
      }
      try {
        const createdBy = await User.findById(context.user.id);
        if (!createdBy) {
          throw new Error('User not found.');
        }

        const tradeList = new TradeList({
          pokemons: args.input.pokemons,
          description: args.input.description,
          isPrivate: args.input.isPrivate,
          createdBy: context.user.id,
        });
        const result = await tradeList.save();

        createdBy.tradeLists.push(tradeList);
        await createdBy.save();

        return transformTradeList(result);
      } catch (error) {
        throw error;
      }
    },
  },
};

export default tradeListResolver;
