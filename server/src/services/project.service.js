const db = require("../config/db");
const { User, Company, Project } = require("../models");
const FakeBoardData = require("../config/task_data");

const {
  HttpStatusCode,
} = require("../helper/http-status-code/http-status-code");
const HttpException = require("../helper/exception/http-exception");
const UserService = require("./user.service");
const CompanyService = require("./company.service");
const role = require("../helper/role");
const Mongoose = require("mongoose");

module.exports = {
  getById,
  crateProject,
  getAllProjects,
};

/**
 * create new task and save to db
 * @param {Object} taskBody
 * @returns {Promise<Task>}
 * @throws {HttpException}
 */
async function crateProject({ companyId, name, description, members, userId }) {
  try {
    // Get user
    const user = await UserService.getById({ id: userId });

    // Check if user exists in company
    const company = await CompanyService.getById(companyId);

    // Check user data within company
    const teamMember = company.members.find((member) => {
      return member.user._id._id == userId;
    });

    // Check if user is a member of company
    if (!teamMember) {
      throw new HttpException(
        HttpStatusCode.FORBIDDEN,
        "You are not a member of this company",
        "Not allowed to create project"
      );
    }

    // Set user role to admin for project
    user.role = role.Admin;
    const project = await Project.create({
      name: name,
      description: description,
      members: [
        {
          user: user.id,
          role: user.role,
          _id: user.id,
        },
      ],
      createdBy: user.id,
      company: company.id,
    });

    // Save project to database
    project.save();

    // return project
    return project;
  } catch (error) {
    throw error;
  }
}

/**
 * Get company by id
 * @param {string} projectId
 * @returns {Promise<Project>}
 * @throws {HttpException}
 */
async function getById(projectId) {
  // Validate project id
  if (!Mongoose.isValidObjectId(projectId)) {
    throw new HttpException(HttpStatusCode.NOT_FOUND, "Invalid project id");
  }

  // Get project from database if exists
  const project = await Project.findOne({ _id: projectId })
    .populate("members.user", "name email id")
    .populate("createdBy", "name id");

  // Check if project exists in db
  if (!project)
    throw new HttpException(
      HttpStatusCode.NOT_FOUND,
      "Project not found",
      "Project does not exists with id '" + projectId + "'"
    );
  // Return project
  return project;
}

/**
 * Get all projects
 * @returns {Promise<Project[]>}
 * @throws {HttpException}
 */

async function getAllProjects(companyId) {
  try {
    // Check if companyId is valid object id
    if (!Mongoose.isValidObjectId(companyId)) {
      throw new HttpException(HttpStatusCode.BAD_REQUEST, "Invalid company id");
    }

    // Get all projects of a company from database if exists
    const projects = await Project.find({ company: companyId })
      .populate("members.user", "name email id")
      .populate("createdBy", "name id");

    // Return all projects
    return projects;
  } catch (error) {
    throw error;
  }
}
