var express = require("express");
var router = express.Router();
const Joi = require("joi");
const ValidationRequest = require("../middleware/validate-request");
const authorize = require("../middleware/authorize");
const { Project, Company, Board } = require("../models");
const { CompanyService } = require("../services");
const Role = require("../helper/role");
const ApiResponseHandler = require("../helper/response/api-response");

const {
  HttpStatusCode,
} = require("../helper/http-status-code/http-status-code");
const FakeBoardData = require("../config/task_data");

router.post("/company/create", authorize(), createCompanySchema, createCompany);
router.get("/company/get_all", authorize(), getAllCompany);
router.get("/company/get_by_id/:id", authorize(), getCompanyById);
router.put(
  "/company/:companyId/add_members",
  authorize(),
  addMembersSchema,
  addMembers
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

// Get company by Id
function getCompanyById(req, res, next) {
  const user = req.auth;
  const { id } = req.params;
  if (!id) {
    return ApiResponseHandler.error({
      res: res,
      message: "Company id is required",
      status: HttpStatusCode.BAD_REQUEST,
    });
  }

  CompanyService.getById(id, user.id)
    .then((company) => {
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
  const { companyId } = req.params;
  const { members } = req.body;

  console.log(
    "🚀 ~ file: company.controller.js ~ line 114 ~ addMembers ~ members:",
    members
  );

  CompanyService.addMembers(companyId, user.id, members)
    .then((company) => {
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

module.exports = router;
