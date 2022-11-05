const Mongoose = require("mongoose");
const db = require("../config/db");
const { promise: fs } = require("fs");
const { User, Company } = require("../models");
// const { UserService } = require("../services");
const UserService = require("../services/user.service");
const FakeBoardData = require("../config/task_data");
const Role = require("../helper/role");

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
  addMembers,
  removeMembers,
  getJoinedCompanies,
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
    return (await company.populate("members.user", "name id")).populate(
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
 * @returns {Promise<Company>}
 * @throws {Error}
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
    .populate("members.user", "name email id")
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
      .populate("members.user", "name")
      .populate("createdBy", "name")
      .populate({
        path: "members",
        transform: (doc) => {
          return doc;
        },
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

/**
 * Gel all joined companies
 * @param {ObjectId} userId
 * @returns {Promise<Company[]>}
 * @throws {HttpException}
 */
async function getJoinedCompanies(userId) {
  try {
    const user = await UserService.getById({ id: userId });
    const companies = await Company.find({ "members.user": user.id })
      .populate("members.user", "name")
      .populate("createdBy", "name");
    return companies;
  } catch (error) {
    throw error;
  }
}

/**
 * Add members to company
 * @param {ObjectId} companyId
 * @param {Array} members
 * @param {ObjectId} userId
 * @returns {Promise<Company>}
 * @throws {Error}
 */

async function addMembers(companyId, userId, members) {
  try {
    // Check if company exists
    const company = await findCompany(companyId);

    const user = company.members.find((member) => member.user._id == userId);

    // Check if auth user is a member of company or not, if he/she is not company owner
    if (company.createdBy.id !== userId) {
      // Check if user is member of company
      if (!user) {
        throw new HttpException(
          HttpStatusCode.FORBIDDEN,
          "You are not a member of this company",
          "Not authorized to add members"
        );
      } else if (user.role !== Role.Admin) {
        throw new HttpException(
          HttpStatusCode.FORBIDDEN,
          "You are not a allowed to add member in this company, Only admin can add members",
          "Not authorized to add members"
        );
      }
    }

    // Add members to company
    const newMembers = members.map((member) => ({
      user: member.id,
      role: member.role,
      _id: member.id,
    }));

    // Check is user already exists in company
    const existingMembers = company.members.filter((member) =>
      newMembers.find((newMember) => newMember.user == member.user._id)
    );

    // Throw error if trying to add existingMembers
    if (existingMembers.length > 0) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        `${existingMembers.length} of ${newMembers.length} users already exists in company`,
        existingMembers.map((member) => {
          return {
            id: member.user._id,
            role: member.role,
          };
        })
      );
    }

    company.members = [...company.members, ...newMembers];

    await company.save();

    return findCompany(companyId);
  } catch (error) {
    throw error;
  }
}

/**
 * Get company complete info
 */
async function findCompany(companyId) {
  if (!Mongoose.isValidObjectId(companyId)) {
    throw new HttpException(HttpStatusCode.BAD_REQUEST, "Invalid company id");
  }
  const company = await Company.findOne({ _id: companyId })
    .populate("members.user", "name")
    .populate("createdBy", "name");
  if (!company || company === null) {
    throw new HttpException(
      HttpStatusCode.NOT_FOUND,
      "Company not found",
      "Company not found with id " + companyId
    );
  }
  return company;
}

/**
 * Remove members from a company
 * @param {ObjectId} companyId
 * @param {Array} members
 * @param {ObjectId} userId
 * @return {Promise<Company>}
 * @throws {Error}
 */
async function removeMembers(companyId, userId, members) {
  try {
    // get company data if exists
    const company = await findCompany(companyId);

    // Get current auth user from company if exists
    const user = company.members.find((member) => member.user._id == userId);

    // No need to verify if company owner is a member or not
    if (userId !== company.createdBy.id) {
      // Check if current auth user is member of company
      if (!user) {
        throw new HttpException(
          HttpStatusCode.FORBIDDEN,
          "You are not a member of this company",
          "Not authorized to remove members"
        );
      }
      // Check if current auth user is company admin or not
      else if (user.role !== Role.Admin) {
        throw new HttpException(
          HttpStatusCode.FORBIDDEN,
          "You are not a allowed to remove member in this company, Only admin can remove members",
          "Not authorized to remove members"
        );
      }
    }

    // Filter out remaining members
    const remainingMembers = company.members.filter((member) => {
      return !members.includes(member.id);
    });

    // Update company members
    company.members = remainingMembers;

    // Save company
    await company.save();

    return company;
  } catch (error) {
    throw error;
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
