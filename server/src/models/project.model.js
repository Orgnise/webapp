const Mongoose = require("mongoose");

const ProjectSchema = new Mongoose.Schema({
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
  owner: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  members: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
  contributors: [
    {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
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
  isDeactivated: {
    type: Boolean,
    default: false,
  },
  deactivatedAt: {
    type: Date,
    default: null,
  },
  deactivatedBy: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  deactivatedNote: {
    type: String,
    default: null,
  },
});

module.exports = Mongoose.model("Project", ProjectSchema);
