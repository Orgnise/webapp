const Mongoose = require("mongoose");

const CommentSchema = new Mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

module.exports = Mongoose.model("Comment", CommentSchema);
