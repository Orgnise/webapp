const Mongoose = require("mongoose");
const Schema = Mongoose.Schema;

const CompanySchema = new Schema(
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
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User",
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
      default: Date.now,
    },
  },
  {
    timestamps: true,

    toObject: {
      transform: (obj, ret) => {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
  }
);

CompanySchema.virtual("isDeactivated").get(function () {
  return this.deactivatedAt !== null;
});

module.exports = Mongoose.model("Company", CompanySchema);
