import fetch from 'node-fetch';

const raidPokemon = async (raid, models) => {
  try {
    const pokemonName = raid.pokemon.replace('_FORM', '');
    const pokemonData = await models.Pokemon.findOne({ name: pokemonName });

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
    getRaids: async (_parent, _args, { models }) => {
      try {
        const raids = await models.Raid.find()
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
    initRaids: async (_parent, _args, { user, models }) => {
      if (!user || !user.roles.includes('admin')) {
        throw new Error('Unathorized');
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
            return raidPokemon(raid, models);
          });

          await models.Raid.remove({}); // Wipe previous data

          return await models.Raid.create({
            tier: tier.tier,
            raids: await Promise.all(raidResult),
          });
        });
      } catch (error) {
        throw error;
      }
    },
  },
};

export default raidResolver;
