const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RefreshTokenSchema = new Schema({
  token: {
    type: String,
    required: true,
    unique: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  expires: {
    type: Date,
    required: true,
  },
  created: {
    type: Date,
    default: Date.now,
  },
  createdByIp: {
    type: String,
    required: true,
  },
  revoked: {
    type: Date,
  },
  revokedByIp: {
    type: String,
  },
  replacedByToken: {
    type: String,
  },
});

RefreshTokenSchema.virtual("isExpired").get(function () {
  return Date.now() >= this.expires;
});

RefreshTokenSchema.virtual("isActive").get(function () {
  return !this.revoked && !this.isExpired;
});

RefreshTokenSchema.set("toJSON", {
  transform: (doc, ret) => {
    delete ret.user;
    return ret;
  },
});

module.exports = mongoose.model("RefreshToken", RefreshTokenSchema);
