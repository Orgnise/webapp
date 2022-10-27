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
    });
    return {
      id: company._id,
      name: company.name,
      description: company.description,
      members: company.members,
      createdBy: user,
    };
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
  if (!id) {
    throw new HttpException(
      HttpStatusCode.UNPROCESSABLE_ENTITY,
      "companyId is required"
    );
  } else {
    const company = await Company.findOne({ id: id });
    if (!company) throw "Board not found";
    console.log(
      "🚀 ~ file: company.service.js ~ line 78 ~ getById ~ company",
      company
    );
    // return getBasicCompanyInfo(company);
    return company.toObject();
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
      "userId is required"
    );
  }
  try {
    const companies = await Company.find({ createdBy: userId });
    return Promise.all(
      companies.map(async (company) => {
        const cc = getBasicCompanyInfo(company);
        cc.createdBy = await UserService.getById(company.createdBy._id);
        return cc;
      })
    );
  } catch (error) {
    throw new HttpException(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
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
