import { gql } from 'apollo-server-express';

const EventSchema = gql`
  # *****************************
  # Type Objects
  # *****************************
  type Event {
    id: ID!
    name: String
    img: String
    imgFull: String
    description: String
    descriptionFull: String
    starts: String
    ends: String
  }

  # *****************************
  # Input Objects
  # *****************************

  # *****************************
  # Queries
  # *****************************
  extend type Query {
    # Get all Events
    getEvents: [Event!]!

    # Get Event by ID
    getEvent(id: ID!): Event!
  }
  # *****************************
  # Mutations
  # *****************************
`;

export default EventSchema;
