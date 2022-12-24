var express = require("express");
var router = express.Router();
const Joi = require("joi");
const ValidationRequest = require("../middleware/validate-request");
const authorize = require("../middleware/authorize");
const { Workspace, Team, Board } = require("../models");
const { TeamService } = require("../services");
const Role = require("../helper/role");
const ApiResponseHandler = require("../helper/response/api-response");
const { updateCache } = require("../helper/redis/redis-client");
const cacheMiddleWare = require("../middleware/cache-middleware");

const {
  HttpStatusCode,
} = require("../helper/http-status-code/http-status-code");
const FakeBoardData = require("../config/task_data");

router.post("/team/create", authorize(), createTeamSchema, createTeam);
router.get("/team/all", authorize(), getAllTeam);
router.get("/team/joined", authorize(), getJoinedTeams);
router.get(
  "/team/:id",
  authorize(),
  cacheMiddleWare({
    keyPath: "params.id",
    cacheDataKey: "team",
    cacheDataMessage: "Team fetched successfully",
  }),
  getTeamById
);
router.get(
  "/team/slug/:slug",
  authorize(),
  cacheMiddleWare({
    keyPath: "params.slug",
    cacheDataKey: "team",
    cacheDataMessage: "Team fetched successfully",
  }),
  getTeamBySlug
);
router.put(
  "/team/:orgId/add_members",
  authorize(), // authorize(Role.Admin),
  addMembersSchema,
  addMembers // <--- Add members
);
router.put(
  "/team/:orgId/remove_members",
  authorize(),
  removeMembersSchema,
  removeMembers // <--- Remove members
);

function createTeamSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).trim().required(),
    description: Joi.string().min(3).max(180),
    members: Joi.array().items(Joi.string()),
  });
  ValidationRequest(req, next, schema);
}

function createTeam(req, res, next) {
  const data = req.body;
  const user = req.auth;

  TeamService.createTeam(data, user.id)
    .then((board) => {
      return ApiResponseHandler.success({
        res: res,
        data: board,
        message: "Team created successfully",
        dataKey: "team",
        status: HttpStatusCode.CREATED,
      });
    })
    .catch(next);
}

function getAllTeam(req, res, next) {
  const user = req.auth;

  TeamService.getAllTeam(user.id)
    .then((teams) => {
      return ApiResponseHandler.success({
        res: res,
        data: teams,
        message: "Team fetched successfully",
        dataKey: "teams",
        status: HttpStatusCode.OK,
        total: teams.length,
      });
    })
    .catch(next);
}

function getJoinedTeams(req, res, next) {
  const user = req.auth;

  TeamService.getJoinedTeams(user.id)
    .then((teams) => {
      return ApiResponseHandler.success({
        res: res,
        data: teams,
        message: "Team fetched successfully",
        dataKey: "teams",
        status: HttpStatusCode.OK,
        total: teams.length,
      });
    })
    .catch(next);
}

// Get team by Id
async function getTeamById(req, res, next) {
  const user = req.auth;
  const { id } = req.params;
  if (!id) {
    return ApiResponseHandler.error({
      res: res,
      message: "Team id is required",
      status: HttpStatusCode.BAD_REQUEST,
    });
  }

  TeamService.getById(id, user.id)
    .then(async (team) => {
      await updateCache(id, team);

      return ApiResponseHandler.success({
        res: res,
        data: team,
        message: "Team fetched successfully",
        dataKey: "team",
        status: HttpStatusCode.OK,
      });
    })
    .catch(next);
}

// Get team by slug
async function getTeamBySlug(req, res, next) {
  const user = req.auth;
  const { slug } = req.params;
  if (!slug) {
    return ApiResponseHandler.error({
      res: res,
      message: "Team slug is required",
      status: HttpStatusCode.BAD_REQUEST,
    });
  }

  TeamService.getBySlug(slug, user.id)
    .then(async (team) => {
      await updateCache(slug, team);

      return ApiResponseHandler.success({
        res: res,
        data: team,
        message: "Team fetched successfully",
        dataKey: "team",
        status: HttpStatusCode.OK,
      });
    })
    .catch(next);
}

// Add members to team schema
function addMembersSchema(req, res, next) {
  const schema = Joi.object({
    members: Joi.array().items(
      Joi.object({
        role: Joi.string()
          .valid(Role.Admin, Role.Moderator, Role.User)
          .default(Role.User),
        id: Joi.string().required(),
      })
    ),
  });
  ValidationRequest(req, next, schema);
}

// Add members to team
function addMembers(req, res, next) {
  const user = req.auth;
  const { orgId } = req.params;
  const { members } = req.body;

  TeamService.addMembers(orgId, user.id, members)
    .then(async (team) => {
      await updateCache(orgId, team);
      return ApiResponseHandler.success({
        res: res,
        data: team,
        message: "Members added successfully",
        dataKey: "team",
        status: HttpStatusCode.OK,
      });
    })
    .catch(next);
}

// Remove members from team schema
function removeMembersSchema(req, res, next) {
  const schema = Joi.object({
    members: Joi.array().items(Joi.string().required()),
  });
  ValidationRequest(req, next, schema);
}

// Remove members from team
function removeMembers(req, res, next) {
  const user = req.auth;
  const { orgId } = req.params;
  const { members } = req.body;

  TeamService.removeMembers(orgId, user.id, members)
    .then(async (team) => {
      await updateCache(orgId, team);

      return ApiResponseHandler.success({
        res: res,
        data: team,
        message: "Members removed successfully",
        dataKey: "team",
        status: HttpStatusCode.OK,
      });
    })
    .catch(next);
}

module.exports = router;
