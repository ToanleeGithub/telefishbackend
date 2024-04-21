require("dotenv").config();

const mongoose = require("mongoose");

const connectToDB = async () => {
  const uri = process.env.MONGO_URI;
  try {
    const currentState = mongoose.connection.readyState;

    switch (currentState) {
      case 1:
        console.log("Already connected to database...");
        break;
      case 2:
        console.log("Currently connecting to database...");
        break;
      default:
        await mongoose.connect(uri, { dbName: "fish" });
        console.log("Successful connected to the fish database");
    }
  } catch (error) {
    console.error("Error connecting to database", error);
  }
};

module.exports = connectToDB;
