const Mongoose = require("mongoose");
const Role = require("../helper/role");

const WorkspaceSchema = new Mongoose.Schema(
  {
    team: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Team",
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
      trim: true,
      minlength: 3,
    },
    members: [
      {
        user: {
          type: Mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: [Role.Admin, Role.User],
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
    meta: {
      type: Object,
      default: {},
      title: "",
      description: "",
      slug: "",
    },
  },
  { timestamps: true }
);

WorkspaceSchema.virtual("isCompleted").get(function () {
  return this.completedAt !== null;
});

WorkspaceSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.__v;
    ret.id = ret._id;
    delete ret._id;
    return ret;
  },
});

module.exports = Mongoose.model("Workspace", WorkspaceSchema);
