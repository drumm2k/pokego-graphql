import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    team: {
      type: String,
      required: true,
    },
    isBanned: { type: Boolean, default: false },
    isOnline: { type: Boolean, default: false },
    tradeLists: [
      {
        type: Schema.Types.ObjectId,
        ref: 'TradeList',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
