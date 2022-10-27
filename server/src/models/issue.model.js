const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const IssueSchema = new Schema({
  summary: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  description: {
    type: String,
    trim: true,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  issueType: {
    type: Schema.Types.ObjectId,
    ref: "IssueType",
    required: true,
  },
  priority: {
    type: String,
    required: true,
    trim: true,
    minlength: 3,
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: "Comment",
      required: true,
    },
  ],
  isArchived: {
    type: Boolean,
    default: false,
  },
});

module.exports = Mongoose.model("Issue", IssueSchema);
