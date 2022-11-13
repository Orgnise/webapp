const express = require("express");
const router = express.Router();
const Joi = require("joi");
const ValidationRequest = require("../middleware/validate-request");
const authorize = require("../middleware/authorize");
const Role = require("../helper/role");
const UserService = require("../services/user.service");
const ApiResponseHandler = require("../helper/response/api-response");
const HttpStatusCode = require("../helper/http-status-code/http-status-code");
const cacheMiddleWare = require("../middleware/cache-middleware");
const { updateCache } = require("../helper/redis/redis-client");
// routes
router.post("/auth/register", registerSchema, registerUser);
router.post("/auth/login", authenticateSchema, authenticate);
router.post("/auth/refresh-token", refreshToken);
router.post("/auth/revoke-token", authorize(), revokeTokenSchema, revokeToken);
router.get("/auth/all", authorize(Role.User), getAll);
router.get(
  "/auth/:id/get_by_id",
  authorize(),
  cacheMiddleWare({
    keyPath: "params.id",
    cacheDataKey: "user",
    cacheDataMessage: "User fetched successfully",
  }),
  getById
);
router.get("/auth:id/refresh-tokens", authorize(), getRefreshTokens);

module.exports = router;

function authenticateSchema(req, res, next) {
  const schema = Joi.object({
    email: Joi.string().required(),
    password: Joi.string().required(),
  });
  ValidationRequest(req, next, schema);
}

function registerSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string()
      .lowercase()
      .min(6)
      .max(70)
      .email({ tlds: { allow: false }, minDomainSegments: 2 })
      .required(),
    password: Joi.string().min(6).required().strict(),
    role: Joi.string().valid(Role.Admin, Role.User).default(Role.User),
    confirmPassword: Joi.string()
      .valid(Joi.ref("password"))
      .required()
      .strict(),
  });
  ValidationRequest(req, next, schema);
}

// Authenticate user
function authenticate(req, res, next) {
  const { email, password } = req.body;
  const ipAddress = req.socket.localAddress;

  UserService.authenticate({
    email: email,
    password: password,
    ipAddress: "ipAddress",
  })
    .then(({ refreshToken, ...user }) => {
      setTokenCookie(res, refreshToken);
      ApiResponseHandler.success({
        res: res,
        message: "User authenticated successfully",
        data: { ...user, refreshToken },
        dataKey: "user",
      });
    })
    .catch(next);
}

// Create a new user account
function registerUser(req, res, next) {
  const { name, email, password, role } = req.body;
  const ipAddress = req.socket.localAddress;

  UserService.registerUser({
    name: name,
    email: email,
    password: password,
    role: role,
    ipAddress: ipAddress,
  })
    .then(({ user, refreshToken }) =>
      ApiResponseHandler.success({
        res: res,
        data: { ...user, refreshToken },
        dataKey: "user",
        message: "User registered successfully",
        status: HttpStatusCode.CREATED,
      })
    )
    .catch(next);
}

function refreshToken(req, res, next) {
  const refreshToken = req.cookies.refreshToken;
  const ipAddress = req.socket.remoteAddress;
  UserService.refreshToken({ refreshToken, ipAddress })
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
  const ipAddress = req.socket.localAddress;

  if (!token) {
    return res.status(400).json({ message: "Token is required" });
  }

  // users can revoke their own tokens and admins can revoke any tokens
  if (!req.auth.ownsToken(token) && req.auth.role !== Role.Admin) {
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
  UserService.getById({ id: req.params.id, authUser: req.auth })
    .then(async (user) => {
      await updateCache(req.params.id, user);

      return ApiResponseHandler.success({
        res: res,
        data: user,
        dataKey: "user",
        status: HttpStatusCode.OK,
        message: "User fetched successfully",
      });
    })
    .catch(next);
}

// Get refresh token
function getRefreshTokens(req, res, next) {
  // users can get their own refresh tokens and admins can get any user's refresh tokens
  if (req.params.id !== req.auth.id && req.auth.role !== Role.Admin) {
    return ApiResponseHandler.default.error({
      res: res,
      message: "Unauthorized",
      errorCode: HttpStatusCode.ErrorCode(HttpStatusCode.UNAUTHORIZED),
      status: HttpStatusCode.UNAUTHORIZED,
    });
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
