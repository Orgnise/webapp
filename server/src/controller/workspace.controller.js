var express = require("express");
var router = express.Router();
const Joi = require("joi");
const ValidationRequest = require("../middleware/validate-request");
const authorize = require("../middleware/authorize");
const { Workspace, User, Board } = require("../models");
const { TeamService, WorkspaceService } = require("../services");
const ApiResponseHandler = require("../helper/response/api-response");

const {
  HttpStatusCode,
} = require("../helper/http-status-code/http-status-code");
const { Private, Archived,Deleted,Public} = require("../helper/entity-visibility");
const { logInfo } = require("../helper/logger");

router.get("/team/:id/workspace/all", authorize(), getAllWorkspace);
router.get(
  "/team/slug/:slug/workspace/all",
  authorize(),
  getAllWorkspaceBySlug
);
router.post(
  "/team/:id/workspace/create",
  authorize(),
  createWorkspaceSchema,
  createWorkspace
);
router.get("/workspace/get_by_id/:id", authorize(), getWorkspaceById);
router.get("/workspace/slug/:slug", authorize(), getWorkspaceBySlug);
router.put("/workspace/slug/:slug", authorize(),UpdateWorkspaceSchema, UpdateWorkspaceBySlug);
router.delete("/workspace/slug/:slug", authorize(), deleteWorkspaceBySlug);
router.post(
  "/team/:id/workspace/add_examples",
  authorize(),
  addExampleWorkspaceSchema,
  addExamples
);
router.post(
  "/team/:slug/workspace/add_examples",
  authorize(),
  addExampleWorkspaceSchema,
  addExamples
);
router.post(
  "/team/slug/:slug/workspace/add_examples",
  authorize(),
  addExampleWorkspaceSchema,
  addExamplesBySlug
);


function createWorkspaceSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    description: Joi.string().min(3).max(280),
    members: Joi.array().items(Joi.string()),
  });
  ValidationRequest(req, next, schema);
}
function UpdateWorkspaceSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    description: Joi.string().min(3).max(280),
    members: Joi.array().items(Joi.string()),
    teamId: Joi.string().required(),
    visibility: Joi.string().valid(Private, Archived,Deleted,Public).optional(),
  });
  ValidationRequest(req, next, schema);
}

function addExampleWorkspaceSchema(req, res, next) {
  const schema = Joi.object({
    examples: Joi.array().items(Joi.string()).required(),
  });
  ValidationRequest(req, next, schema);
}

function createWorkspace(req, res, next) {
  const { name, description, members } = req.body;
  const orgId = req.params.id;
  const user = req.auth;

  WorkspaceService.crateWorkspace({
    orgId: orgId,
    name: name,
    description: description,
    members: members,
    userId: user.id,
  })
    .then((workspace) => {
      global.socket.emit("team:workspace:create", workspace);
      return ApiResponseHandler.success({
        res: res,
        data: workspace,
        message: "Workspace created successfully",
        dataKey: "workspace",
        status: HttpStatusCode.CREATED,
      });
    })
    .catch(next);
}

/**
 * Update workspace by slug
 */
function UpdateWorkspaceBySlug(req, res, next) {
  const user = req.auth;
  const slug = req.params.slug;
  const { name,  members,visibility,teamId } = req.body;

  WorkspaceService.UpdateWorkspaceBySlug({
    slug: slug,
    name: name,
    teamId: teamId,
    members: members,
    visibility:visibility,
    userId: user.id,
  })
    .then((workspace) => {
      return ApiResponseHandler.success({
        res: res,
        data: workspace,
        message: "Workspace updated successfully",
        dataKey: "workspace",
        status: HttpStatusCode.OK,
      });
    })
    .catch(next);
}

/**
 * Add example workspaces
 */
function addExamples(req, res, next) {
  const { examples } = req.body;
  const orgId = req.params.id;

  const user = req.auth;

  WorkspaceService.addExamples({
    orgId: orgId,
    examples: examples,
    userId: user.id,
  })
    .then((workspaces) => {
      // global.socket.emit("team:workspace:create", workspaces);
      return ApiResponseHandler.success({
        res: res,
        data: workspaces,
        message: "Example workspaces created successfully",
        dataKey: "workspaces",
        status: HttpStatusCode.CREATED,
      });
    })
    .catch(next);
}

/**
 * Add example workspaces using team slug
 */
function addExamplesBySlug(req, res, next) {
  const { examples } = req.body;
  const slug = req.params.slug;

  const user = req.auth;

  WorkspaceService.addExamplesBySlug({
    slug: slug,
    examples: examples,
    userId: user.id,
  })
    .then((workspaces) => {
      // global.socket.emit("team:workspace
      return ApiResponseHandler.success({
        res: res,
        data: workspaces,
        message: "Example workspaces created successfully",
        dataKey: "workspaces",
        status: HttpStatusCode.CREATED,
      });
    })
    .catch(next);
}

/**
 * Get all workspaces
 */
function getAllWorkspace(req, res, next) {
  const user = req.auth;
  const orgId = req.params.id;

  WorkspaceService.getAllWorkspace(orgId)
    .then((teams) => {
      return ApiResponseHandler.success({
        res: res,
        data: teams,
        message: "Workspaces fetched successfully",
        dataKey: "Workspaces",
        status: HttpStatusCode.OK,
        total: teams.length,
      });
    })
    .catch(next);
}

/**
 * Get all workspaces by team slug
 */
function getAllWorkspaceBySlug(req, res, next) {
  const user = req.auth;
  const slug = req.params.slug;

  WorkspaceService.getAllWorkspaceBySlug(slug)
    .then((teams) => {
      return ApiResponseHandler.success({
        res: res,
        data: teams,
        message: "Workspaces fetched successfully",
        dataKey: "Workspaces",
        status: HttpStatusCode.OK,
        total: teams.length,
      });
    })
    .catch(next);
}

/**
 * Get workspace by id
 */
function getWorkspaceById(req, res, next) {
  const user = req.auth;
  const id = req.params.id;
  WorkspaceService.getById(id)
    .then((workspace) => {
      return ApiResponseHandler.success({
        res: res,
        data: workspace,
        message: "Workspace fetched successfully",
        dataKey: "workspace",
        status: HttpStatusCode.OK,
      });
    })
    .catch(next);
}

/**
 * Get workspace by slug
 */
function getWorkspaceBySlug(req, res, next) {
  const user = req.auth;
  const slug = req.params.slug;
  WorkspaceService.getBySlug(slug)
    .then((workspace) => {
      return ApiResponseHandler.success({
        res: res,
        data: workspace,
        message: "Workspace fetched successfully",
        dataKey: "workspace",
        status: HttpStatusCode.OK,
      });
    })
    .catch(next);
}

/**
 * Delete workspace by slug.
 * Delete all collections of workspace.
 */
function deleteWorkspaceBySlug(req,res,next){
  const user = req.auth;
  const slug = req.params.slug;
  WorkspaceService.deleteBySlug(slug)
  .then((workspace) => {
    return ApiResponseHandler.success({
      res: res,
      data: workspace,
      message: "Workspace deleted successfully",
      dataKey: "workspace",
      status: HttpStatusCode.OK,
    });
  })
  .catch(next);
}

module.exports = router;
