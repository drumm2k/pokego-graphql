import { gql } from 'apollo-server-express';

const FollowSchema = gql`
  # *****************************
  # Type Objects
  # *****************************
  type Follow {
    id: ID!
    user: User
    follower: User
  }

  # *****************************
  # Input Objects
  # *****************************
  input CreateFollowInput {
    userId: ID!
    followerId: ID!
  }

  input DeleteFollowInput {
    id: ID!
  }

  # *****************************
  # Mutations
  # *****************************
  extend type Mutation {
    # Create following/follower relationship between users
    createFollow(input: CreateFollowInput!): Follow

    # Delete following/follower relationship between users
    deleteFollow(input: DeleteFollowInput!): Follow
  }
`;

export default FollowSchema;
