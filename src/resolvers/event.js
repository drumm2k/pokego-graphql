const events = require('../../lib/events.json');

const eventResolver = {
  Query: {
    getEvents(parent, args, context, info) {
      return events.events;
    },
    getEvent(obj, args, context, info) {
      return events.events.find((event) => event.id === parseInt(args.id));
    },
  },
  Mutation: {},
};

export default eventResolver;
