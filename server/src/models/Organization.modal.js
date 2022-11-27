const Mongoose = require("mongoose");
const Role = require("../helper/role");
const Schema = Mongoose.Schema;

const OrganizationSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    createdBy: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
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
    deactivatedAt: {
      type: Date,
    },
    deactivatedBy: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    deactivatedNote: {
      type: String,
      trim: true,
      minlength: 3,
    },
    reactivatedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (obj, ret) => {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        // ret.members.user.id = user._id;
        // delete ret.members.user._id;

        return ret;
      },
    },
  }
);

OrganizationSchema.virtual("membersCount").get(function () {
  return this.members.length;
});

OrganizationSchema.virtual("isDeactivated").get(function () {
  return this.deactivatedAt !== null;
});

module.exports = Mongoose.model("Organization", OrganizationSchema);
