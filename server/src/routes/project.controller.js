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
const FakeBoardData = require("../config/task_data");

router.get("/organization/:id/project/all", authorize(), getAllProjects);
router.post(
  "/organization/:id/project/create",
  authorize(),
  createProjectSchema,
  createProject
);
router.get("/project/get_by_id/:id", authorize(), getProjectById);

function createProjectSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    description: Joi.string().min(3).max(280),
    members: Joi.array().items(Joi.string()),
  });
  ValidationRequest(req, next, schema);
}

function createProject(req, res, next) {
  const { name, description, members } = req.body;
  const companyId = req.params.id;
  const user = req.auth;

  ProjectService.crateProject({
    companyId: companyId,
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
 * Get all projects
 */
function getAllProjects(req, res, next) {
  const user = req.auth;
  const companyId = req.params.id;

  ProjectService.getAllProjects(companyId)
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

module.exports = router;
