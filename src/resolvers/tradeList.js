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
      try {
        const createdBy = await User.findById('5f0b7c72485aa61cf1f1a5a5');
        if (!createdBy) {
          throw new Error('User not found.');
        }

        const tradeList = new TradeList({
          pokemons: args.input.pokemons,
          description: args.input.description,
          isPrivate: args.input.isPrivate,
          createdBy: '5f0b7c72485aa61cf1f1a5a5',
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
