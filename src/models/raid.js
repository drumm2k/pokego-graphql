import mongoose from 'mongoose';

const { Schema } = mongoose;

const raidSchema = new Schema(
  {
    tier: {
      type: String,
      required: true,
    },
    raids: [
      {
        pokemon: {
          type: Schema.Types.ObjectId,
          ref: 'Pkmn',
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

module.exports = mongoose.model('Raid', raidSchema);
