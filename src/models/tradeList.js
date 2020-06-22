import mongoose from 'mongoose';

const { Schema } = mongoose;

const tradeListSchema = new Schema(
  {
    pokemons: {
      type: [String],
      required: true,
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

module.exports = mongoose.model('TradeList', tradeListSchema);
