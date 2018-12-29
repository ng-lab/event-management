const Event = require("../../models/event");
const User = require("../../models/user");

const { curatedEvent }  = require('./utilities');

const fetchevents = async _ => {
    try {
      const events = await Event.find();
      return events.map(event => {
        return curatedEvent(event);
      });
    } catch (error) {
      throw error;
    }
  };

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
      createdEvent = curatedEvent(event);
      let creator = await User.findById("5c1f63682a513048b45194cd");
      if (!creator) {
        throw new Error("User Not Found");
      }
      creator.createdEvents.push(event);
      await creator.save();
  
      return createdEvent;
    } catch (error) {
      throw error;
    }
  };

exports.fetchevents = fetchevents;
exports.createEvent = createEvent;