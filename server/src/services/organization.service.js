const Mongoose = require("mongoose");
const db = require("../config/db");
const { promise: fs } = require("fs");
const { User, Organization } = require("../models");
// const { UserService } = require("../services");
const UserService = require("./user.service");
const FakeBoardData = require("../config/task_data");
const Role = require("../helper/role");

const {
  HttpStatusCode,
} = require("../helper/http-status-code/http-status-code");
const HttpException = require("../helper/exception/http-exception");
const { Admin } = require("../helper/role");
const { Promise } = require("mongoose");
const { generateSlug } = require("../helper/slug-helper");

module.exports = {
  getById,
  getBySlug,
  createCompany,
  getAllCompany,
  addMembers,
  removeMembers,
  getJoinedCompanies,
};

/**
 * Create new organization and save to db
 * @param {Object} body - organization data
 * @returns {Promise<Organization>}
 * @throws {Error}
 */
async function createCompany(body, userId) {
  try {
    const { name, description, createdBy } = body;

    // Check if organization already exists with same name
    if (await Organization.findOne({ name })) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        "Organization already exists"
      );
    }

    // Get user data
    const user = await UserService.getById({ id: userId });

    // Generate slug for organization
    const slug = await generateSlug({
      name,
      didExist: async (val) => {
        return await Organization.findOne({ "meta.slug": val });
      },
    });

    // Set user role to admin for organization
    user.role = Admin;
    const organization = await Organization.create({
      name,
      description,
      createdBy: user.id,
      members: [{ user: user.id, role: user.role, _id: user.id }],
      meta: {
        title: name,
        description: "",
        slug: slug,
      },
    });

    // return organization data
    return (await organization.populate("members.user", "name id")).populate(
      "createdBy",
      "name id"
    );
  } catch (error) {
    throw new HttpException(
      error.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      error.message,
      error.error
    );
  }
}

/**
 * Get organization by id
 * @param {ObjectId} Id
 * @returns {Promise<Organization>}
 * @throws {Error}
 */
async function getById(id) {
  // Check if id is a valid organization id
  if (!Mongoose.isValidObjectId(id)) {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      "",
      "Invalid organization id"
    );
  }
  // Get organization data using organization id if exists
  const organization = await Organization.findOne({ _id: id })
    .populate("members.user", "name email id")
    .populate("createdBy", "name id");

  // Check if organization exists
  if (!organization) {
    throw new HttpException(
      HttpStatusCode.NOT_FOUND,
      "No organization found with",
      "Organization does not exist with " + id + " id"
    );
  }

  return getBasicCompanyInfo(organization);
}

/**
 * Get organization by slug
 * @param {String} slug
 * @returns {Promise<Organization>}
 * @throws {Error}
 */
async function getBySlug(slug) {
  if (!slug)
    throw new HttpException(HttpStatusCode.BAD_REQUEST, "Invalid slug");

  // Get organization data using organization id if exists
  const organization = await Organization.findOne({ "meta.slug": slug })
    .populate("members.user", "name email id")
    .populate("createdBy", "name id");

  // Check if organization exists
  if (!organization) {
    throw new HttpException(
      HttpStatusCode.NOT_FOUND,
      "No organization found",
      "Organization does not exist with slug -" + slug
    );
  }

  return getBasicCompanyInfo(organization);
}

/**
 * Get all organization basic info for user
 * @param {ObjectId} userId
 * @returns {Promise<Organization[]>}
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
    const companies = await Organization.find({
      members: { $elemMatch: { user: userId } },
    })
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
 * @returns {Promise<Organization[]>}
 * @throws {HttpException}
 */
async function getJoinedCompanies(userId) {
  try {
    const user = await UserService.getById({ id: userId });
    const companies = await Organization.find({ "members.user": user.id })
      .populate("members.user", "name")
      .populate("createdBy", "name");
    return companies;
  } catch (error) {
    throw error;
  }
}

/**
 * Add members to organization
 * @param {ObjectId} companyId
 * @param {Array} members
 * @param {ObjectId} userId
 * @returns {Promise<Organization>}
 * @throws {Error}
 */

async function addMembers(companyId, userId, members) {
  try {
    // Check if organization exists
    const organization = await findCompany(companyId);

    const user = organization.members.find(
      (member) => member.user._id == userId
    );

    // Check if auth user is a member of organization or not, if he/she is not organization owner
    if (organization.createdBy.id !== userId) {
      // Check if user is member of organization
      if (!user) {
        throw new HttpException(
          HttpStatusCode.FORBIDDEN,
          "You are not a member of this organization",
          "Not authorized to add members"
        );
      } else if (user.role !== Role.Admin) {
        throw new HttpException(
          HttpStatusCode.FORBIDDEN,
          "You are not a allowed to add member in this organization, Only admin can add members",
          "Not authorized to add members"
        );
      }
    }

    // Add members to organization
    const newMembers = members.map((member) => ({
      user: member.id,
      role: member.role,
      _id: member.id,
    }));

    // Check is user already exists in organization
    const existingMembers = organization.members.filter((member) =>
      newMembers.find((newMember) => newMember.user == member.user._id)
    );

    // Throw error if trying to add existingMembers
    if (existingMembers.length > 0) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        `${existingMembers.length} of ${newMembers.length} users already exists in organization`,
        existingMembers.map((member) => {
          return {
            id: member.user._id,
            role: member.role,
          };
        })
      );
    }

    organization.members = [...organization.members, ...newMembers];

    await organization.save();

    return findCompany(companyId);
  } catch (error) {
    throw error;
  }
}

/**
 * Get organization complete info
 */
async function findCompany(companyId) {
  if (!Mongoose.isValidObjectId(companyId)) {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      "Invalid organization id"
    );
  }
  const organization = await Organization.findOne({ _id: companyId })
    .populate("members.user", "name")
    .populate("createdBy", "name");
  if (!organization || organization === null) {
    throw new HttpException(
      HttpStatusCode.NOT_FOUND,
      "Organization not found",
      "Organization not found with id " + companyId
    );
  }
  return organization;
}

/**
 * Remove members from a organization
 * @param {ObjectId} companyId
 * @param {Array} members
 * @param {ObjectId} userId
 * @return {Promise<Organization>}
 * @throws {Error}
 */
async function removeMembers(companyId, userId, members) {
  try {
    // get organization data if exists
    const organization = await findCompany(companyId);

    // Get current auth user from organization if exists
    const user = organization.members.find(
      (member) => member.user._id == userId
    );

    // No need to verify if organization owner is a member or not
    if (userId !== organization.createdBy.id) {
      // Check if current auth user is member of organization
      if (!user) {
        throw new HttpException(
          HttpStatusCode.FORBIDDEN,
          "You are not a member of this organization",
          "Not authorized to remove members"
        );
      }
      // Check if current auth user is organization admin or not
      else if (user.role !== Role.Admin) {
        throw new HttpException(
          HttpStatusCode.FORBIDDEN,
          "You are not a allowed to remove member in this organization, Only admin can remove members",
          "Not authorized to remove members"
        );
      }
    }

    // Filter out remaining members
    const remainingMembers = organization.members.filter((member) => {
      return !members.includes(member.id);
    });

    // Update organization members
    organization.members = remainingMembers;

    // Save organization
    await organization.save();

    return organization;
  } catch (error) {
    throw error;
  }
}

// Helper functions

/**
 * Get basic organization info
 * @param {Organization} organization
 */
function getBasicCompanyInfo(organization) {
  return {
    id: organization.id,
    name: organization.name,
    description: organization.description,
    members: organization.members,
    createdBy: organization.createdBy,
  };
}
