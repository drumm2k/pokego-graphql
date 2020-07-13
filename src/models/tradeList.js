import mongoose from 'mongoose';

const { Schema } = mongoose;

const tradeListSchema = new Schema(
  {
    pokemons: {
      type: [Schema.Types.ObjectId],
      ref: 'Pokemon',
    },
    description: {
      type: String,
      required: true,
    },
    isPrivate: { type: Boolean, default: false },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('TradeList', tradeListSchema);
