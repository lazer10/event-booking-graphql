const userResolver = require('./user');
const eventsResolver = require('./events');
const bookingsResolver = require('./booking');

const rootResolver = {
    ...userResolver,
    ...eventsResolver,
    ...bookingsResolver
};

module.exports = rootResolver;
