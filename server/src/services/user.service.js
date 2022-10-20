const config = require("../config/auth.config");
const Mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const db = require("../config/db");
const User = require("../models/user");
const RefreshToken = require("../models/refresh-token.model");

module.exports = {
  authenticate,
  refreshToken,
  revokeToken,
  getAll,
  getById,
  getRefreshTokens,
};

async function authenticate({ email, password, ipAddress }) {
  const user = await User.findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw "Email or password is incorrect";
  }

  // Authenticate successful so generate jwt and refresh tokens
  const jwtToken = generateJwtToken(user);
  const refreshToken = generateRefreshToken(user, ipAddress);

  // Save refresh token
  await refreshToken.save();

  // Returns basic details and tokens
  return {
    ...basicUserDetails(user),
    jwtToken,
    refreshToken: refreshToken.token,
  };
}

// Revoke refresh token
async function revokeToken({ token, ipAddress }) {
  const refreshToken = await getRefreshToken(token);

  // revoke token and save
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  await refreshToken.save();
}

// Returns basic details for all users
async function getAll() {
  const users = await db.User.find();
  return users.map((x) => basicDetails(x));
}

// Returns basicDetails of user by id
async function getById(id) {
  const user = await getUser(id);
  return basicDetails(user);
}

async function refreshToken({ token, ipAddress }) {
  const refreshToken = await getRefreshToken(token);
  const { user } = refreshToken;

  // replace old refresh token with a new one and save
  const newRefreshToken = generateRefreshToken(user, ipAddress);
  refreshToken.revoked = Date.now();
  refreshToken.revokedByIp = ipAddress;
  refreshToken.replacedByToken = newRefreshToken.token;
  await refreshToken.save();
  await newRefreshToken.save();

  // generate new jwt
  const jwtToken = generateJwtToken(user);

  // return basic details and tokens
  return {
    ...basicUserDetails(user),
    jwtToken,
    refreshToken: newRefreshToken.token,
  };
}

// Returns complete user details
async function getUser(id) {
  if (!Mongoose.Types.ObjectId.isValid(id)) {
    throw "Invalid User Id";
  } else {
    const user = await User.findById(id);
    if (!user) throw "User not found";
    return user;
  }
}

// Returns refresh token from db for given token string if it exists, and isn't revoked
async function getRefreshToken(userId) {
  // check that user exist
  await getUser(userId);

  const refreshToken = await RefreshToken.findOne({ user: userId });
  return refreshToken;
}

// returns list of refresh tokens for a given user id
async function getRefreshTokens(userId) {
  // check that user exists
  await getUser(userId);

  // return refresh tokens for user
  const refreshTokens = await RefreshToken.find({ user: userId });
  return refreshTokens;
}

// helper function

// Creates a new refresh token
function generateRefreshToken(user, ipAddress) {
  // create a refresh token that expires in 7 days
  return new RefreshToken({
    user: user.id,
    token: randomTokenString(),
    expires: new Date(Date.now() + config.jwtRefreshExpiration),
    createdByIp: ipAddress,
  });
}

// Returns a new JWT token containing the user id that expires in 1 hour
function generateJwtToken(user) {
  // create a jwt token containing the user id that expires in 15 minutes
  return jwt.sign({ sub: user.id, id: user.id }, config.jwtTokenSecret, {
    expiresIn: config.jwtExpiration,
  });
}

// Returns a random token string of the given length
function randomTokenString() {
  return crypto.randomBytes(40).toString("hex");
}

// Returns basic user details
function basicUserDetails(user) {
  const { id, name, email, role } = user;
  return { id, name, email, role };
}
