import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    team: {
      type: String,
      required: true,
    },
    trainerCode: String,
    latitude: Number,
    longtitude: Number,
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Follow',
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Follow',
      },
    ],
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
