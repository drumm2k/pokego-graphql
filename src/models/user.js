import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      minlength: 2,
      maxlength: 30,
      match: [/^[a-zA-Z0-9]*$/, 'Username must include only letters and numbers!'],
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      match: [/^\S+@\S+\.\S+$/, 'Please fill a valid email address'],
    },
    password: {
      type: String,
      required: true,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    passwordResetToken: String,
    passwordResetTokenExpiry: Date,
    roles: [String],
    banned: { type: Boolean, default: false },
    confirmed: {
      type: Boolean,
      default: false,
    },
    subscription: Boolean,
    trainer: {
      team: {
        type: String,
        required: true,
        match: [/(valor|mystic|instinct)/, 'Unknown team'],
      },
      level: {
        type: Number,
        min: 1,
        max: 40,
      },
      code: {
        type: String,
        match: [/[\d*]{12}/, 'Code should be exactly 12 digits'],
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
    social: {
      telegram: {
        type: String,
        match: [/^[a-zA-Z0-9]*$/, 'Only letters or digits'],
      },
      discord: {
        type: String,
        match: [/^[a-zA-Z0-9#]*$/, 'Only letters, digits or #'],
      },
    },
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
