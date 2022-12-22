var express = require("express");
var router = express.Router();
const Joi = require("joi");
const ValidationRequest = require("../middleware/validate-request");
const authorize = require("../middleware/authorize");
const { Project, Organization, Board } = require("../models");
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
  "/organization/:id",
  authorize(),
  cacheMiddleWare({
    keyPath: "params.id",
    cacheDataKey: "organization",
    cacheDataMessage: "Organization fetched successfully",
  }),
  getCompanyById
);
router.get(
  "/organization/slug/:slug",
  authorize(),
  cacheMiddleWare({
    keyPath: "params.slug",
    cacheDataKey: "organization",
    cacheDataMessage: "Organization fetched successfully",
  }),
  getCompanyBySlug
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
        message: "Organization created successfully",
        dataKey: "organization",
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
        message: "Organization fetched successfully",
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
        message: "Organization fetched successfully",
        dataKey: "companies",
        status: HttpStatusCode.OK,
        total: companies.length,
      });
    })
    .catch(next);
}

// Get organization by Id
async function getCompanyById(req, res, next) {
  const user = req.auth;
  const { id } = req.params;
  if (!id) {
    return ApiResponseHandler.error({
      res: res,
      message: "Organization id is required",
      status: HttpStatusCode.BAD_REQUEST,
    });
  }

  CompanyService.getById(id, user.id)
    .then(async (organization) => {
      await updateCache(id, organization);

      return ApiResponseHandler.success({
        res: res,
        data: organization,
        message: "Organization fetched successfully",
        dataKey: "organization",
        status: HttpStatusCode.OK,
      });
    })
    .catch(next);
}

// Get organization by slug
async function getCompanyBySlug(req, res, next) {
  const user = req.auth;
  const { slug } = req.params;
  if (!slug) {
    return ApiResponseHandler.error({
      res: res,
      message: "Organization slug is required",
      status: HttpStatusCode.BAD_REQUEST,
    });
  }

  CompanyService.getBySlug(slug, user.id)
    .then(async (organization) => {
      await updateCache(slug, organization);

      return ApiResponseHandler.success({
        res: res,
        data: organization,
        message: "Organization fetched successfully",
        dataKey: "organization",
        status: HttpStatusCode.OK,
      });
    })
    .catch(next);
}

// Add members to organization schema
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

// Add members to organization
function addMembers(req, res, next) {
  const user = req.auth;
  const { orgId } = req.params;
  const { members } = req.body;

  CompanyService.addMembers(orgId, user.id, members)
    .then(async (organization) => {
      await updateCache(orgId, organization);
      return ApiResponseHandler.success({
        res: res,
        data: organization,
        message: "Members added successfully",
        dataKey: "organization",
        status: HttpStatusCode.OK,
      });
    })
    .catch(next);
}

// Remove members from organization schema
function removeMembersSchema(req, res, next) {
  const schema = Joi.object({
    members: Joi.array().items(Joi.string().required()),
  });
  ValidationRequest(req, next, schema);
}

// Remove members from organization
function removeMembers(req, res, next) {
  const user = req.auth;
  const { orgId } = req.params;
  const { members } = req.body;

  CompanyService.removeMembers(orgId, user.id, members)
    .then(async (organization) => {
      await updateCache(orgId, organization);

      return ApiResponseHandler.success({
        res: res,
        data: organization,
        message: "Members removed successfully",
        dataKey: "organization",
        status: HttpStatusCode.OK,
      });
    })
    .catch(next);
}

module.exports = router;
