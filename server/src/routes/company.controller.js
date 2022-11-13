var express = require("express");
var router = express.Router();
const Joi = require("joi");
const ValidationRequest = require("../middleware/validate-request");
const authorize = require("../middleware/authorize");
const { Project, Company, Board } = require("../models");
const { CompanyService } = require("../services");
const Role = require("../helper/role");
const ApiResponseHandler = require("../helper/response/api-response");
const { updateCache } = require("../helper/redis/redis-client");
const cacheMiddleWare = require("../middleware/cache-middleware");

const {
  HttpStatusCode,
} = require("../helper/http-status-code/http-status-code");
const FakeBoardData = require("../config/task_data");

router.post(
  "/organization/create",
  authorize(),
  createCompanySchema,
  createCompany
);
router.get("/organization/all", authorize(), getAllCompany);
router.get(
  "/organization/get_joined_companies",
  authorize(),
  getJoinedCompanies
);
router.get(
  "/organization/get_by_id/:id",
  authorize(),
  cacheMiddleWare({
    keyPath: "params.id",
    cacheDataKey: "company",
    cacheDataMessage: "Company fetched successfully",
  }),
  getCompanyById
);
router.put(
  "/organization/:orgId/add_members",
  authorize(), // authorize(Role.Admin),
  addMembersSchema,
  addMembers // <--- Add members
);
router.put(
  "/organization/:orgId/remove_members",
  authorize(),
  removeMembersSchema,
  removeMembers // <--- Remove members
);

function createCompanySchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).trim().required(),
    description: Joi.string().min(3).max(180),
    members: Joi.array().items(Joi.string()),
  });
  ValidationRequest(req, next, schema);
}

function createCompany(req, res, next) {
  const data = req.body;
  const user = req.auth;

  CompanyService.createCompany(data, user.id)
    .then((board) => {
      return ApiResponseHandler.success({
        res: res,
        data: board,
        message: "Company created successfully",
        dataKey: "company",
        status: HttpStatusCode.CREATED,
      });
    })
    .catch(next);
}

function getAllCompany(req, res, next) {
  const user = req.auth;

  CompanyService.getAllCompany(user.id)
    .then((companies) => {
      return ApiResponseHandler.success({
        res: res,
        data: companies,
        message: "Company fetched successfully",
        dataKey: "companies",
        status: HttpStatusCode.OK,
        total: companies.length,
      });
    })
    .catch(next);
}

function getJoinedCompanies(req, res, next) {
  const user = req.auth;

  CompanyService.getJoinedCompanies(user.id)
    .then((companies) => {
      return ApiResponseHandler.success({
        res: res,
        data: companies,
        message: "Company fetched successfully",
        dataKey: "companies",
        status: HttpStatusCode.OK,
        total: companies.length,
      });
    })
    .catch(next);
}

// Get company by Id
async function getCompanyById(req, res, next) {
  const user = req.auth;
  const { orgId } = req.params;
  if (!orgId) {
    return ApiResponseHandler.error({
      res: res,
      message: "Company id is required",
      status: HttpStatusCode.BAD_REQUEST,
    });
  }

  CompanyService.getById(orgId, user.id)
    .then(async (company) => {
      await updateCache(orgId, company);

      return ApiResponseHandler.success({
        res: res,
        data: company,
        message: "Company fetched successfully",
        dataKey: "company",
        status: HttpStatusCode.OK,
      });
    })
    .catch(next);
}

// Add members to company schema
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

// Add members to company
function addMembers(req, res, next) {
  const user = req.auth;
  const { orgId } = req.params;
  const { members } = req.body;

  CompanyService.addMembers(orgId, user.id, members)
    .then(async (company) => {
      await updateCache(orgId, company);
      return ApiResponseHandler.success({
        res: res,
        data: company,
        message: "Members added successfully",
        dataKey: "company",
        status: HttpStatusCode.OK,
      });
    })
    .catch(next);
}

// Remove members from company schema
function removeMembersSchema(req, res, next) {
  const schema = Joi.object({
    members: Joi.array().items(Joi.string().required()),
  });
  ValidationRequest(req, next, schema);
}

// Remove members from company
function removeMembers(req, res, next) {
  const user = req.auth;
  const { orgId } = req.params;
  const { members } = req.body;

  CompanyService.removeMembers(orgId, user.id, members)
    .then(async (company) => {
      await updateCache(orgId, company);

      return ApiResponseHandler.success({
        res: res,
        data: company,
        message: "Members removed successfully",
        dataKey: "company",
        status: HttpStatusCode.OK,
      });
    })
    .catch(next);
}

module.exports = router;
