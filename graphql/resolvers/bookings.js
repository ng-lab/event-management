const Booking = require("../../models/booking");
const {curatedBooking, curatedEvent} = require('./utilities');

const bookings = async _ => {
    const all_bookings = await Booking.find();
    return all_bookings.map(booking => {
      return curatedBooking(booking);
    });
  };

const cancelBooking = async args => {
    const { bookingId } = args;
    const booking = await Booking.findById(bookingId).populate("event");
    await Booking.deleteOne({ _id: bookingId });
    return curatedEvent(booking.event);
  };
  
  const makeBooking = async args => {
    const booking = new Booking({
      event: args.eventId,
      user: "5c1f63682a513048b45194cd"
    });
  
    const new_booking = await booking.save();
    return curatedBooking(new_booking);
  };

  exports.bookings = bookings;
  exports.cancelBooking = cancelBooking;
  exports.makeBooking = makeBooking;