const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
  },
  csrfToken: {
    type: String,
  },
});

const userModel = mongoose.model("User", userSchema);

module.exports = userModel;
