const Mongoose = require("mongoose");

const ColumnSchema = new Mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

ColumnSchema.virtual("membersCount").get(function () {
  return this.members.length;
});

module.exports = Mongoose.model("Column", ColumnSchema);
