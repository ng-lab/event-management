const bcrypt = require("bcryptjs");

// custom imports
const Event = require("../../models/event");
const User = require("../../models/user");
const Booking = require('../../models/booking');

// Utility fns
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

const events = async ids => {
  try {
    const events = await Event.find({ _id: { $in: ids } });
    return events.map(event => {
      return {
        ...event._doc,
        _id: event.id,
        creator: user.bind(this, event._doc.creator)
      };
    });
  } catch (error) {
    throw error;
  }
};

const fetchevents = async _ => {
    try {
        const events = await Event.find();
        return events.map(event => {
          return {
            ...event._doc,
            id: event.id,
            date: new Date(event._doc.date).toISOString(),
            creator: user.bind(this, event._doc.creator)
          };
        });
      } catch (error) {
        throw error;
      }
}

const users = async _ => {
    try {
        const users = await User.find();
        return users.map(user => {
          return {
            ...user._doc,
            _id: user.id,
            createdEvents: events.bind(this, user._doc.createdEvents)
          };
        });
      } catch (error) {
        throw error;
      }
}

const createEvent = async _ => {
    let event = new Event({
        title: args.eventInput.title,
        description: args.eventInput.description,
        price: +args.eventInput.price,
        date: new Date(args.eventInput.date),
        creator: "5c1f63682a513048b45194cd"
      });
        let createdEvent;
      try {
        let result = await event.save();
          createdEvent = {
          ...result._doc,
          _id: result.id,
          date: new Date(result._doc.date).toISOString(),
          creator: user.bind(this, result._doc.creator)
        };
        let creator = await User.findById("5c1f63682a513048b45194cd");
        if(!creator) {
            throw new Error('User Not Found');
        }
        creator.createdEvents.push(event);
        await creator.save();
     
        return createdEvent;
      } catch (error) {
          throw error;
      }
}

const createUser =  async args => {
    try {
      const existingUser = await User.findOne({ email: args.userInput.email });
      if (existingUser) {
        throw new Error('User exists already.');
      }
      const hashedPassword = await bcrypt.hash(args.userInput.password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword
      });

      const result = await user.save();

      return { ...result._doc, password: null, _id: result.id };
    } catch (err) {
      throw err;
    }
  }

  const fetchEvent = async id => {
    const event = await Event.findById(id);
    try {
        return {
          ...event._doc,
          id: event.id,
          date: new Date(event._doc.date).toISOString(),
          creator: user.bind(this, event._doc.creator)
        };
    } catch (error) {
      throw error;
    }
  }

  const makeBooking = async args => {
    const booking = new Booking({
      event: args.eventId,
      user: '5c1f63682a513048b45194cd'
    });

    const new_booking = await booking.save();

    return {
      ...new_booking._doc,
      _id: new_booking.id,
      createdAt: new Date(new_booking._doc.createdAt).toISOString(),
      updatedAt: new Date(new_booking._doc.updatedAt).toISOString(),
      user: user.bind(this, new_booking._doc.user),
      event: fetchEvent.bind(this, new_booking._doc.event)
    }
  }

  const bookings = async _ => {
    const all_bookings = await Booking.find();
    return all_bookings.map(booking => {
      return {
        ...booking._doc,
        _id: booking.id,
        createdAt: new Date(booking._doc.createdAt).toISOString(),
        updatedAt: new Date(booking._doc.updatedAt).toISOString(),
        user: user.bind(this, booking._doc.user),
        event: fetchEvent.bind(this, booking._doc.event)
      }
    })
  }

  const cancelBooking = async args => {
      const {bookingId} = args;
      const booking = await Booking.findById(bookingId).populate('event');
      await Booking.deleteOne({_id: bookingId});
      return booking.event;
  }
let root = {
  events:fetchevents,
  users,
  bookings,
  createEvent,
  createUser,
  makeBooking,
  cancelBooking
};

module.exports = root;
