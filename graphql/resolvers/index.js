// Resolvers Imports
const { fetchevents, createEvent } = require('./events');
const {createUser, users}  = require('./auth');
const { bookings, cancelBooking, makeBooking } = require('./bookings');

let root = {
  events: fetchevents,
  users,
  bookings,
  createEvent,
  createUser,
  makeBooking,
  cancelBooking
};

module.exports = root;
