const express = require("express");
const app = express();
const port = 3001;
const connectToDB = require("./connectToDB");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const cors = require("cors");
const userModel = require("./model");
const Other = require("./other");
const other = new Other();
const exphbs = require("express-handlebars");
const path = require("path");
require("dotenv").config();

connectToDB();

const store = new MongoDBStore({
  databaseName: "session",
  uri: process.env.MONGO_URI,
  collection: "mySessions",
});

store.on("error", (error) => {
  console.error("Session store error:", error);
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "https://telefish.fun",
    // origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(
  session({
    secret: "create secret key",
    cookie: {
      maxAge: 1000 * 60,
      secure: false, // Đặt thành true khi sử dụng HTTPS
    },
    resave: false,
    saveUninitialized: true,
    store: store,
  })
);
app.use(express.static(path.join(__dirname, "src")));

const hbsInstance = exphbs.create();
app.engine("handlebars", hbsInstance.engine);
app.set("view engine", "handlebars");

app.post("/api/start", async (req, res) => {
  try {
    const username = req.body.username;
    const csrfToken = other.generateSecureToken();

    const user = await userModel.findOne({ username: username });
    if (!user) {
      await userModel.create({ username: username, csrfToken: csrfToken });
    } else {
      await userModel.updateOne(
        { username: username },
        { $set: { csrfToken: csrfToken } }
      );
    }
    res.json({ csrfToken: csrfToken });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.post("/api/login", async (req, res) => {
  console.log("api/login da nhan");
  try {
    const csrfTokenClient = req.get("csrf-token") || req.headers["csrf-token"];
    const username = req.body.username;

    if (!username) {
      res.json({ status: "usename not found!" });
      return;
    }

    const user = await userModel.findOne({ username: username });
    if (!user) {
      res.json({ status: "USER NOT FOUND!" });
      return;
    }

    if (csrfTokenClient !== user.csrfToken) {
      res.json({ status: "fail to connect" });
      return;
    } else {
      req.session.username = username;
      console.log("session LOGIN: ", req.session.username);
      res.json({ status: "success", username: username });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.post("/api/getUserInfo", (req, res) => {
  console.log("session USER: ", req.session.username);
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
