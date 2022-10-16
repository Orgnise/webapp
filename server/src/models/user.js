const Mongoose = require("mongoose");

const UserSchema = new Mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  email: {
    type: String,
    required: false,
    trim: true,
    minlength: 3,
  },
  role: {
    type: String,
    required: false,
    trim: true,
    minlength: 3,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model("User", UserSchema);
