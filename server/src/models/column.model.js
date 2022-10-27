const Mongoose = require("mongoose");

const ColumnSchema = new Mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  maxIssueCount: {
    type: Number,
    required: true,
    trim: true,
    minlength: 3,
  },
  issues: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Mongoose.model("Column", ColumnSchema);
