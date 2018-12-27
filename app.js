const express = require("express");
const bodyParser = require("body-parser");
const graphqlHTTP = require("express-graphql");
const mongoose = require("mongoose");

const root = require('./graphql/resolvers');
const schema = require('./graphql/schemas');


const app = express();

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
    app.listen(4000, _ => {
      console.log("Server Running at port 3000...");
    });
  })
  .catch(_ => {
    console.log("Error connecting Databse");
  });
