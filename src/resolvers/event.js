const events = require('../../lib/events.json');

const eventResolver = {
  Query: {
    getEvents(_parent, _args, _context) {
      return events.events;
    },
    getEvent(_parent, { id }, _context) {
      return events.events.find((event) => event.id === parseInt(id, 10));
    },
  },
  Mutation: {},
};

export default eventResolver;
