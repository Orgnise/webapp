const Mongoose = require("mongoose");

const ProjectSchema = new Mongoose.Schema(
  {
    company: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
    },
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
    members: [
      {
        ...{
          type: Mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["admin", "member"],
          default: "member",
        },
      },
    ],
    completedAt: {
      type: Date,
      default: undefined,
    },
    createdBy: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

ProjectSchema.virtual("isCompleted").get(function () {
  return this.completedAt !== null;
});

ProjectSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

module.exports = Mongoose.model("Project", ProjectSchema);
