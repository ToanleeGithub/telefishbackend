const express = require("express");
const app = express();
const port = 3001;
const connectToDB = require("./connectToDB");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
require("dotenv").config();

connectToDB();

const store = new MongoDBStore({
  databaseName: "session",
  uri: process.env.MONGO_URI,
  collection: "mySessions",
});

store.on("error", (error) => {
  console.log(error);
});

app.use(
  session({
    secret: "your secret",
    cookie: {
      maxAge: 1000 * 60,
      secure: false,
    },
    store: store,
    resave: false,
    saveUninitialized: true,
  })
);

app.get("/", (req, res) => {
  if (req.session.views) {
    req.session.views++;
  } else {
    req.session.views = 1;
  }
  res.send(`Số lần xem trang: ${req.session.views}`);
});

app.listen(port, () => {
  console.log("Server running on port 3001");
});
