import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
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
    passwordResetToken: String,
    passwordResetTokenExpiry: Date,
    roles: [String],
    banned: { type: Boolean, default: false },
    online: { type: Boolean, default: false },
    confirmed: {
      type: Boolean,
      default: false,
    },
    subscription: Boolean,
    trainer: {
      team: {
        type: String,
      },
      level: {
        type: Number,
      },
      code: {
        type: String,
      },
    },
    location: {
      latitude: {
        type: Number,
      },
      longtitude: {
        type: Number,
      },
    },
    social: { telegram: String, discord: String },
    tradeLists: [
      {
        type: Schema.Types.ObjectId,
        ref: 'TradeList',
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model('User', userSchema);
