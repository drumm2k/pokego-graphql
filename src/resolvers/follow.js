import Follow from '../models/follow';
import User from '../models/user';

const followResolver = {
  Query: {},
  Mutation: {
    createFollow: async (
      parent,
      { input: { userId, followerId } },
      context,
      info
    ) => {
      try {
        // Need to add check if the follower is the authorized user and this follow is connected to him
        // Check if already following?
        const follow = await new Follow({
          user: userId,
          follower: followerId,
        }).save();

        // Push follower/following to user collection
        await User.findOneAndUpdate(
          { _id: userId },
          { $push: { followers: follow.id } }
        );
        await User.findOneAndUpdate(
          { _id: followerId },
          { $push: { following: follow.id } }
        );

        return follow;
      } catch (error) {
        throw error;
      }
    },
    deleteFollow: async (parent, { input: { id } }) => {
      try {
        // Need to add check if the follower is the authorized user and this follow was created by him
        const follow = await Follow.findByIdAndRemove(id);

        // Delete follow from users collection
        await User.findOneAndUpdate(
          { _id: follow.user },
          { $pull: { followers: follow.id } }
        );
        await User.findOneAndUpdate(
          { _id: follow.follower },
          { $pull: { following: follow.id } }
        );

        return follow;
      } catch (error) {
        throw error;
      }
    },
  },
};

export default followResolver;
