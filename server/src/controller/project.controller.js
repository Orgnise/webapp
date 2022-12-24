var express = require("express");
var router = express.Router();
const Joi = require("joi");
const ValidationRequest = require("../middleware/validate-request");
const authorize = require("../middleware/authorize");
const { Project, User, Board } = require("../models");
const { CompanyService, ProjectService } = require("../services");
const ApiResponseHandler = require("../helper/response/api-response");

const {
  HttpStatusCode,
} = require("../helper/http-status-code/http-status-code");

router.get("/organization/:id/project/all", authorize(), getAllProjects);
router.get(
  "/organization/slug/:slug/project/all",
  authorize(),
  getAllProjectsBySlug
);
router.post(
  "/organization/:id/project/create",
  authorize(),
  createProjectSchema,
  createProject
);
router.get("/project/get_by_id/:id", authorize(), getProjectById);
router.get("/project/slug/:slug", authorize(), getProjectBySlug);
router.post(
  "/organization/:id/project/add_examples",
  authorize(),
  addExampleProjectSchema,
  addExamples
);
router.post(
  "/organization/:slug/project/add_examples",
  authorize(),
  addExampleProjectSchema,
  addExamples
);
router.post(
  "/organization/slug/:slug/project/add_examples",
  authorize(),
  addExampleProjectSchema,
  addExamplesBySlug
);

function createProjectSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    description: Joi.string().min(3).max(280),
    members: Joi.array().items(Joi.string()),
  });
  ValidationRequest(req, next, schema);
}

function addExampleProjectSchema(req, res, next) {
  const schema = Joi.object({
    examples: Joi.array().items(Joi.string()).required(),
  });
  ValidationRequest(req, next, schema);
}

function createProject(req, res, next) {
  const { name, description, members } = req.body;
  const orgId = req.params.id;
  const user = req.auth;

  ProjectService.crateProject({
    orgId: orgId,
    name: name,
    description: description,
    members: members,
    userId: user.id,
  })
    .then((project) => {
      global.socket.emit("organization:project:create", project);
      return ApiResponseHandler.success({
        res: res,
        data: project,
        message: "Project created successfully",
        dataKey: "project",
        status: HttpStatusCode.CREATED,
      });
    })
    .catch(next);
}

/**
 * Add example projects
 */
function addExamples(req, res, next) {
  const { examples } = req.body;
  const orgId = req.params.id;

  const user = req.auth;

  ProjectService.addExamples({
    orgId: orgId,
    examples: examples,
    userId: user.id,
  })
    .then((projects) => {
      // global.socket.emit("organization:project:create", projects);
      return ApiResponseHandler.success({
        res: res,
        data: projects,
        message: "Example projects created successfully",
        dataKey: "projects",
        status: HttpStatusCode.CREATED,
      });
    })
    .catch(next);
}

/**
 * Add example projects using organization slug
 */
function addExamplesBySlug(req, res, next) {
  const { examples } = req.body;
  const slug = req.params.slug;

  const user = req.auth;

  ProjectService.addExamplesBySlug({
    slug: slug,
    examples: examples,
    userId: user.id,
  })
    .then((projects) => {
      // global.socket.emit("organization:project
      return ApiResponseHandler.success({
        res: res,
        data: projects,
        message: "Example projects created successfully",
        dataKey: "projects",
        status: HttpStatusCode.CREATED,
      });
    })
    .catch(next);
}

/**
 * Get all projects
 */
function getAllProjects(req, res, next) {
  const user = req.auth;
  const orgId = req.params.id;

  ProjectService.getAllProjects(orgId)
    .then((companies) => {
      return ApiResponseHandler.success({
        res: res,
        data: companies,
        message: "Projects fetched successfully",
        dataKey: "Projects",
        status: HttpStatusCode.OK,
        total: companies.length,
      });
    })
    .catch(next);
}

/**
 * Get all projects by organization slug
 */
function getAllProjectsBySlug(req, res, next) {
  const user = req.auth;
  const slug = req.params.slug;

  ProjectService.getAllProjectsBySlug(slug)
    .then((companies) => {
      return ApiResponseHandler.success({
        res: res,
        data: companies,
        message: "Projects fetched successfully",
        dataKey: "Projects",
        status: HttpStatusCode.OK,
        total: companies.length,
      });
    })
    .catch(next);
}

/**
 * Get project by id
 */
function getProjectById(req, res, next) {
  const user = req.auth;
  const id = req.params.id;
  ProjectService.getById(id)
    .then((project) => {
      return ApiResponseHandler.success({
        res: res,
        data: project,
        message: "Project fetched successfully",
        dataKey: "project",
        status: HttpStatusCode.OK,
      });
    })
    .catch(next);
}

/**
 * Get project by slug
 */
function getProjectBySlug(req, res, next) {
  const user = req.auth;
  const slug = req.params.slug;
  ProjectService.getBySlug(slug)
    .then((project) => {
      return ApiResponseHandler.success({
        res: res,
        data: project,
        message: "Project fetched successfully",
        dataKey: "project",
        status: HttpStatusCode.OK,
      });
    })
    .catch(next);
}

module.exports = router;
