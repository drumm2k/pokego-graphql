import mongoose from 'mongoose';

const { Schema } = mongoose;

const pokemonSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  pokedex: {
    type: Number,
    required: true,
  },
  gen: {
    type: String,
    required: true,
  },
  shiny: {
    type: Boolean,
    required: true,
  },
  released: {
    type: Boolean,
    required: true,
  },
  type1: {
    type: String,
    required: true,
  },
  type2: {
    type: String,
  },
  baseStamina: {
    type: Number,
    required: true,
  },
  baseAttack: {
    type: Number,
    required: true,
  },
  baseDefense: {
    type: Number,
    required: true,
  },
  quickMoves: {
    type: [
      {
        type: String,
      },
    ],
  },
  cinematicMoves: {
    type: [
      {
        type: String,
      },
    ],
  },
  pokemonClass: {
    type: String,
  },
  parentId: {
    type: String,
  },
  familyId: {
    type: String,
  },
  kmBuddyDistance: {
    type: Number,
  },
  evolutionBranch: [
    {
      evolution: { type: String },
      evolutionItemRequirement: { type: String },
      candyCost: { type: Number },
      form: { type: String },
    },
  ],
  thirdMoveStardust: {
    type: Number,
  },
  thirdMoveCandy: {
    type: Number,
  },
});

module.exports = mongoose.model('Pkmn', pokemonSchema);
