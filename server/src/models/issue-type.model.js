const Mongoose = require("mongoose");

const IssueType = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  category: {
    type: String,
    trim: true,
  },
});

module.exports = Mongoose.model("IssueType", IssueType);
