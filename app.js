const express = require("express");
const bodyParser = require("body-parser");
const graphqlHTTP = require("express-graphql");
const { buildSchema } = require("graphql");
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');

// custom imports
const Event = require("./models/event");
const User = require("./models/user");

const app = express();

let events = [];

let schema = buildSchema(`
    type Event {
        _id: ID!
        title: String!
        description: String!
        price: Float!
        date: String!
    }

    type User {
        _id: ID!
        email: String!
        password: String
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
    }

    type RootMutation {
        createEvent(eventInput: EventInput):Event
        createUser(userInput: UserInput): User
    }
    
    schema {
        query: RootQuery,
        mutation: RootMutation 
    }
`);

let root = {
  events: _ => {
    return Event.find()
      .then(events => {
        return events.map(event => {
          return {
            ...event._doc,
            id: event.id
          };
        });
      })
      .catch(err => {
        throw err;
      });
  },
  createEvent: args => {
    let event = new Event({
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date),
      creator: '5c18ab189b9fe3043f654b16'
    });
    let createdEvent;
    return event
      .save()
      .then(result => {
        createdEvent = {...result._doc, id: result.id};
          return User.findById('5c18ab189b9fe3043f654b16')
      })
      .then(user => {
        user.createdEvents.push(event);
        user.save();
      })
      .then(_ => {
          console.log("createdEvent:::", createdEvent);
          return createdEvent
        })
      .catch(err => {
        console.log("Error", err);
      });
  },
  createUser: args => {
      const email = args.userInput.email;
      return User.findOne({email}).then(user => {
          if(user) {
              throw new Error('User Exists in Database...');
          }else {
            return bcrypt.hash(args.userInput.password, 12)
          }
      }).catch()
   
    .then(hashed => {
        let user = new User({
            email,
            password: hashed
          });
          return user.save(user).then(result => {
            return {...result._doc, id: result.id}
        })
    })
   
      
  }
};

app.use(
  "/api",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
  })
);

const db_atlas = `mongodb+srv://mean-u5xne.mongodb.net/?retryWrites=true`;

mongoose
  .connect(
    db_atlas,
    {
      user: "aakash",
      pass: "phenom123#",
      dbName: "events_graph",
      useNewUrlParser: true
    }
  )
  .then(_ => {
    console.log("connection successfull Database");
    app.listen(3000, _ => {
      console.log("Server Running at port 3000...");
    });
  })
  .catch(_ => {
    console.log("Error connecting Databse");
  });
