const Mongoose = require("mongoose");

const UserSchema = new Mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z0-9 ]{3,30}$/.test(v);
        },
        message: (props) => `${props.value} is not a valid name!`,
      },
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
      minlength: 3,
    },
    role: {
      type: String,
      required: false,
      trim: true,
      minlength: 3,
      default: "user",
    },
    token: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (obj, ret) => {
        delete ret.__v;
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
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

module.exports = Mongoose.model("User", UserSchema);
