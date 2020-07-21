import { gql } from 'apollo-server-express';

import EventSchema from './event';
import PokemonSchema from './pokemon';
import RaidSchema from './raid';
import TradeListSchema from './tradeList';
import UserSchema from './user';

const schema = gql`
  type Query {
    _empty: String
  }
  type Mutation {
    _empty: String
  }
  type Subscription {
    _empty: String
  }
  ${EventSchema}
  ${PokemonSchema}
  ${RaidSchema}
  ${TradeListSchema}
  ${UserSchema}
`;

export default schema;
