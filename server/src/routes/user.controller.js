const express = require("express");
const router = express.Router();
const Joi = require("joi");
const ValidationRequest = require("../middleware/validate-request");
// const authorize = require("../middleware/auth-middleware");
const authorize = require("../middleware/authorize");
const Role = require("../helper/role");
const UserService = require("../services/user.service");

// routes
router.post("/authenticate", authenticateSchema, authenticate);
router.post("/refresh-token", refreshToken);
router.post("/revoke-token", authorize(), revokeTokenSchema, revokeToken);
router.get("/all", authorize(Role.Admin), getAll);
router.get("/:id", authorize(), getById);
router.get("/:id/refresh-tokens", authorize(), getRefreshTokens);

module.exports = router;

function authenticateSchema(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  ValidationRequest(req, next, schema);
}

function authenticate(req, res, next) {
  const { email, password } = req.body;
  const { ipAddress } = req.ip;

  UserService.authenticate({ email, password, ipAddress })
    .then(({ refreshToken, ...user }) => {
      setTokenCookie(res, refreshToken);
      res.json(user);
    })
    .catch(next);
}

function refreshToken(req, res, next) {
  const token = req.cookie.refreshToken;
  const ipAddress = req.ip;
  UserService.refreshToken({ token, ipAddress })
    .then(({ refreshToken, ...user }) => {
      setTokenCookie(res, refreshToken);
      res.json(user);
    })
    .catch(next);
}

function revokeTokenSchema(req, res, next) {
  const schema = Joi.object({
    token: Joi.string().empty(""),
  });

  ValidationRequest(req, next, schema);
}

function revokeToken(req, res, next) {
  // access token from request body or cookie
  const token = req.body.token || req.cookies.refreshToken;
  const ipAddress = req.ip;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  // users can revoke their own tokens and admins can revoke any tokens
  if (!req.user.ownsToken(token) && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  UserService.revokeToken(token, ipAddress)
    .then(() => res.json({ message: "Token revoked" }))
    .catch(next);
}

function getAll(req, res, next) {
  UserService.getAll()
    .then((users) => res.json(users))
    .catch(next);
}

// Get user by Id
function getById(req, res, next) {
  // regular users can only access their own account and admins can access any account
  if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  UserService.getById(req.params.id)
    .then((user) => (user ? res.json(user) : res.sendStatus(404)))
    .catch(next);
}

// Get refresh token
function getRefreshTokens(req, res, next) {
  // users can get their own refresh tokens and admins can get any user's refresh tokens
  if (req.params.id !== req.user.id && req.user.role !== Role.Admin) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  UserService.getRefreshTokens(req.params.id)
    .then((tokens) => (tokens ? res.json(tokens) : res.sendStatus(404)))
    .catch(next);
}

// helper functions

function setTokenCookie(res, token) {
  // create http only cookie with refresh token that expires in 7 days
  const cookieOptions = {
    httpOnly: true,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
  };
  res.cookie("refreshToken", token, cookieOptions);
}
