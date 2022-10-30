const Mongoose = require("mongoose");
const db = require("../config/db");
const { promise: fs } = require("fs");
const { User, Company } = require("../models");
// const { UserService } = require("../services");
const UserService = require("../services/user.service");
const FakeBoardData = require("../config/task_data");

const {
  HttpStatusCode,
} = require("../helper/http-status-code/http-status-code");
const HttpException = require("../helper/exception/http-exception");
const { Admin } = require("../helper/role");
const { Promise } = require("mongoose");

module.exports = {
  getById,
  createCompany,
  getAllCompany,
};

/**
 * Create new company and save to db
 * @param {Object} body - company data
 * @returns {Promise<Company>}
 * @throws {Error}
 */
async function createCompany(body, userId) {
  try {
    const { name, description, createdBy } = body;

    // Check if company already exists with same name
    if (await Company.findOne({ name })) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        "Company already exists"
      );
    }

    // Get user data
    const user = await UserService.getById(userId);

    // Set user role to admin for company
    user.role = Admin;
    const company = await Company.create({
      name,
      description,
      createdBy: user.id,
      members: [{ user: user.id, role: user.role, _id: user.id }],
    });

    // return company data
    return (await company.populate("members.user", "name email id")).populate(
      "createdBy",
      "name id"
    );
  } catch (error) {
    throw new HttpException(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
}

/**
 * Get company by id
 * @param {ObjectId} Id
 */
async function getById(id) {
  // Check if id is a valid company id
  if (!Mongoose.isValidObjectId(id)) {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      "",
      "Invalid company id"
    );
  }
  // Get company data using company id if exists
  const company = await Company.findOne({ _id: id })
    .populate({
      path: "members.user",
      select: "name email id",
    })
    .populate("createdBy", "name id");

  // Check if company exists
  if (!company) {
    throw new HttpException(
      HttpStatusCode.NOT_FOUND,
      "No company found with",
      "Company does not exist with " + id + " id"
    );
  }

  return getBasicCompanyInfo(company);
}

/**
 * Get all company basic info for user
 * @param {ObjectId} userId
 * @returns {Promise<Company[]>}
 * @throws {HttpException}
 */

async function getAllCompany(userId) {
  if (!userId) {
    throw new HttpException(
      HttpStatusCode.UNPROCESSABLE_ENTITY,
      "userId cannot be empty or null",
      "userId is required"
    );
  }
  try {
    const companies = await Company.find({ createdBy: userId })
      .populate({
        path: "members.user",
        select: "name",
        transform: (doc) =>
          doc == null ? null : { name: doc.name, email: doc.email },
      })
      .populate({
        path: "createdBy",
        select: "name",
      });

    return companies;
  } catch (error) {
    throw new HttpException(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      "",
      error.message
    );
  }
}

// Helper functions

/**
 * Get basic company info
 * @param {Company} company
 */
function getBasicCompanyInfo(company) {
  return {
    id: company.id,
    name: company.name,
    description: company.description,
    members: company.members,
    createdBy: company.createdBy,
  };
}
