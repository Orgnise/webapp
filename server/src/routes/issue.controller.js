var express = require("express");
var router = express.Router();
const Joi = require("joi");
const ValidationRequest = require("../middleware/validate-request");
const authorize = require("../middleware/authorize");
const { Project, User, Board } = require("../models");
const { CompanyService } = require("../services");
const ApiResponseHandler = require("../helper/response/api-response");

const {
  HttpStatusCode,
} = require("../helper/http-status-code/http-status-code");
const FakeBoardData = require("../config/task_data");

router.get("/issue/create", authorize(), createIssueSchema, createIssue);

function createIssueSchema(req, res, next) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    description: Joi.string().min(3).max(180),
    createdBy: Joi.string().required(),
    members: Joi.array().items(Joi.string()),
  });
  ValidationRequest(req, next, schema);
}

function createIssue(req, res, next) {
  CompanyService.createIssue(req.body)
    .then((board) => {
      return ApiResponseHandler.success({
        res: res,
        data: board,
        message: "Issue created successfully",
        dataKey: "issue",
        status: HttpStatusCode.CREATED,
      });
    })
    .catch(next);
}

module.exports = router;
