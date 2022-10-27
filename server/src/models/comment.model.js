const Mongoose = require("mongoose");

const CommentSchema = new Mongoose.Schema({
  content: {
    type: String,
    trim: true,
    minlength: 1,
  },
  createdBy: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model("Comment", CommentSchema);
