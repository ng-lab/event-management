const { buildSchema } = require("graphql");

let schema = buildSchema(`
    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
        creator: User
    }

    type User {
        _id: ID!
        email: String!
        password: String
        createdEvents: [Event]!
    }

    type Booking {
        _id: ID!
        event: Event!
        user: User!
        createdAt: String!
        updatedAt: String!
    }

    input EventInput {
        title: String!
        description: String!
        price: Float!
        date: String! 
    }

    input UserInput {
        email: String!
        password: String!
    }

    type RootQuery {
        events: [Event!]!
        users: [User!]!
        bookings: [Booking!]!
    }

    type RootMutation {
        createEvent(eventInput: EventInput):Event
        createUser(userInput: UserInput): User
        makeBooking(eventId: String): Booking
        cancelBooking(bookingId: String): Event
    }

    
    schema {
        query: RootQuery,
        mutation: RootMutation 
    }
`);

module.exports = schema;