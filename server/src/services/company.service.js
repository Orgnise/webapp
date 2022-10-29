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

    // Get user
    const user = await UserService.getById(userId);

    // Set user role to admin in company
    user.role = Admin;
    const company = await Company.create({
      name,
      description,
      createdBy: user.id,
      members: [{ user: user.id, role: user.role, _id: user.id }],
    });
    return company;
  } catch (error) {
    throw new HttpException(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      error.message
    );
  }
}

/**
 * Get company by id
 * @param {ObjectId} companyId
 */
async function getById(id) {
  if (!Mongoose.isValidObjectId(id)) {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      "",
      "Invalid company id"
    );
  } else {
    const company = await Company.findOne({ _id: id }).populate({
      path: "members.user",
      select: "name email id",
    });
    if (!company) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        "No company found with this id",
        "Company not found"
      );
    }

    return getBasicCompanyInfo(company);
  }
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
    const companies = await Company.find({ createdBy: userId }).populate({
      path: "members.user",
      select: "name email",
      transform: (doc) =>
        doc == null ? null : { name: doc.name, email: doc.email },
    });
    return Promise.all(
      companies.map(async (company) => {
        const cc = getBasicCompanyInfo(company);
        cc.createdBy = await UserService.getById(company.createdBy._id);
        return cc;
      })
    );
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
 */
function getBasicCompanyInfo(company) {
  const { id, name, description, members, createdBy } = company;
  return {
    id,
    name,
    description,
    members,
    createdBy,
  };
}
