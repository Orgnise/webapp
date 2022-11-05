const config = require("../config/auth.config");
const Mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const db = require("../config/db");
const User = require("../models/user");
const RefreshToken = require("../models/refresh-token.model");
const {
  HttpStatusCode,
} = require("../helper/http-status-code/http-status-code");
const HttpException = require("../helper/exception/http-exception");

module.exports = {
  authenticate,
  refreshToken,
  revokeToken,
  getAll,
  getById,
  getRefreshTokens,
  registerUser,
  getUserFromJwtToken,
};

// Authenticate user
async function authenticate({ email, password, ipAddress }) {
  const user = await User.findOne({ email });

  if (!user || !bcrypt.compareSync(password, user.password)) {
    throw new HttpException(
      HttpStatusCode.UNAUTHORIZED,
      "Email or password is incorrect"
    );
  }

  // Authenticate successful so generate jwt and refresh tokens
  const jwtToken = generateJwtToken(user);
  const refreshToken = generateRefreshToken(user, ipAddress);

  // Save refresh token
  await refreshToken.save();

  // Returns basic details and tokens
  return {
    ...user.userBasicInfo(),
    jwtToken,
    refreshToken: refreshToken.token,
  };
}

// Register user
async function registerUser({ name, email, password, role, ipAddress }) {
  // validate
  if (await User.findOne({ email })) {
    throw {
      message: "Email " + email + " is already registered",
      status: 400,
    };
  }

  encryptedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    name,
    email,
    password: encryptedPassword,
    role,
  });

  const jwtToken = generateJwtToken(user);
  const refreshToken = generateRefreshToken(user, ipAddress);

  // Save refresh token
  await refreshToken.save();
  user.token = jwtToken;

  // save user
  await user.save();

  return {
    user: {
      id: user._id,
      role: user.role,
      name: user.name,
      email: user.email,
      token: jwtToken,
      createdAt: user.createdAt,
    },
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
  const users = await User.find();
  return users.map((x) => x.userBasicInfo());
}

// Returns basicDetails of user by id
async function getById({ id, authUser }) {
  const user = await getUser(id);
  if (authUser.id !== user.id) {
    return user.userBasicInfo();
  } else {
    return user.userWithoutPassword();
  }
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
    ...user.userBasicInfo(),
    jwtToken,
    refreshToken: newRefreshToken.token,
  };
}

// Returns complete user details using the given user id
async function getUser(id) {
  if (!Mongoose.Types.ObjectId.isValid(id)) {
    throw new HttpException(HttpStatusCode.BAD_REQUEST, "", "Invalid user id");
  } else {
    const user = await User.findById(id);
    if (!user) throw "User not found";
    return user;
  }
}

// Returns basic details for a user using given jwt token
async function getUserFromJwtToken(token) {
  const decoded = jwt.verify(token, config.jwtTokenSecret);
  const user = await User.findById(decoded.id);
  if (!user)
    throw new HttpException(HttpStatusCode.UNAUTHORIZED, "", "Invalid token");
  return user;
}

// Returns refresh token from db for given token string if it exists, and isn't revoked
async function getRefreshToken(rfToken) {
  const refreshToken = await RefreshToken.findOne({ rfToken }).populate("user");
  if (!refreshToken) {
    throw new HttpException(
      HttpStatusCode.UNAUTHORIZED,
      "Invalid token",
      "Refresh token not found"
    );
  } else if (!refreshToken.isActive) {
    throw new HttpException(
      HttpStatusCode.UNAUTHORIZED,
      "Token expired",
      "Refresh token expired token"
    );
  }
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
  return jwt.sign({ id: user._id, email: user.email }, config.jwtTokenSecret, {
    expiresIn: config.jwtExpiration,
  });
}

// Returns a random token string of the given length
function randomTokenString() {
  return crypto.randomBytes(40).toString("hex");
}
