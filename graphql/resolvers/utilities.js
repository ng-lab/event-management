const { dateToString } = require("../helpers");
const Event = require("../../models/event");
const User = require("../../models/user");

const curatedEvent = event => {
    return {
      ...event._doc,
      _id: event.id,
      date: dateToString(event._doc.date),
      creator: user.bind(this, event._doc.creator)
    };
  };

  const fetchEvent = async id => {
    const event = await Event.findById(id);
    try {
      return curatedEvent(event);
    } catch (error) {
      throw error;
    }
  };

  const events = async ids => {
    try {
      const events = await Event.find({ _id: { $in: ids } });
      return events.map(event => {
        return curatedEvent(event);
      });
    } catch (error) {
      throw error;
    }
  };

  const user = async userId => {
    try {
      const user = await User.findById(userId);
      // this will automatically get returned
      const curatedUser = {
        ...user._doc,
        _id: user.id,
        createdEvents: events.bind(this, user._doc.createdEvents)
      };
      return curatedUser;
    } catch (error) {
      throw error;
    }
  };


  const curatedBooking = booking => {
    return {
      ...booking._doc,
      _id: booking.id,
      createdAt: dateToString(booking._doc.createdAt),
      updatedAt: dateToString(booking._doc.updatedAt),
      user: user.bind(this, booking._doc.user),
      event: fetchEvent.bind(this, booking._doc.event)
    };
  }

  exports.curatedEvent = curatedEvent;
  exports.user = user;
  exports.fetchEvent = fetchEvent;
  exports.events = events;
  exports.curatedBooking = curatedBooking;