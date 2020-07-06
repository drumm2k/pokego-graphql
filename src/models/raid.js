import mongoose from 'mongoose';

const { Schema } = mongoose;

const raidSchema = new Schema(
  {
    tier: {
      type: String,
      required: true,
    },
    rds: [
      {
        pokemon: {
          type: String,
          required: true,
        },
        cp: {
          type: Number,
        },
        shiny: {
          type: Boolean,
        },
        verified: {
          type: Boolean,
        },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Rd', raidSchema);
