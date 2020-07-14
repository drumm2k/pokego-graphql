import fetch from 'node-fetch';
import Raid from '../models/raid';
import Pokemon from '../models/pokemon';

const raidPokemon = async (raid) => {
  try {
    const pokemonName = raid.pokemon.replace('_FORM', '');
    const pokemonData = await Pokemon.findOne({ name: pokemonName });

    return {
      pokemon: pokemonData._id,
      cp: raid.cp,
      shiny: raid.shiny,
      verified: raid.verified,
    };
  } catch (error) {
    throw error;
  }
};

const raidResolver = {
  Query: {
    getRaids: async () => {
      try {
        const raids = await Raid.find()
          .sort({ tier: 1 })
          .populate({ path: 'raids', populate: { path: 'pokemon' } });

        return raids.map(async (tier) => {
          return {
            ...tier._doc,
            id: tier.id,
          };
        });
      } catch (error) {
        throw error;
      }
    },
  },
  Mutation: {
    initRaids: async (parent, args, context, info) => {
      if (!context.user || !context.user.roles.includes('admin')) {
        throw new Error('Unathenticated');
      }

      try {
        const raids = await fetch('https://fight.pokebattler.com/raids');
        const raidsData = await raids.json();

        // Filter raids level 1-5
        const levels = [1, 2, 3, 4, 5];
        const raidList = levels.map((level) =>
          raidsData.tiers.find((raid) => raid.tier === `RAID_LEVEL_${level}`)
        );

        return raidList.map(async (tier) => {
          const raidResult = tier.raids.map((raid) => {
            return raidPokemon(raid);
          });

          const raid = new Raid({
            tier: tier.tier,
            raids: await Promise.all(raidResult),
          });

          raid.save();

          return { ...raid._doc, id: raid.id };
        });
      } catch (error) {
        throw error;
      }
    },
  },
};

export default raidResolver;
