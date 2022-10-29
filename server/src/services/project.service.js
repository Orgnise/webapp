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

async function getById(userId) {
  if (!id) {
    throw new HttpException(HttpStatusCode.NOT_FOUND, "Board not found");
  } else {
    const board = await Company.find({ createdBy: userId });
    if (!board) throw "Board not found";
    return board;
  }
}

/**
 * create new task and save to db
 * @param {Object} taskBody
 * @returns {Promise<Task>}
 * @throws {Error}
 */
async function crateProject({ companyId, name, description, members, userId }) {
  try {
    // Get user
    const user = await UserService.getById(userId);

    // Check if user exists in company
    const company = await CompanyService.getById(companyId);

    // Check if company exists
    if (!company) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        "Company does not exists"
      );
    }
    const teamMember = company.members.find((member) => {
      // console.log(
      //   "🚀 ~ file: project.service.js ~ line 57 member",
      //   member.user._id._id,
      //   ", userId:",
      //   new Mongoose.Types.ObjectId(userId)
      // );
      return member.user._id._id == userId;
    });
    console.log(
      "🚀 ~ file: project.service.js ~ line 59 ~ isTeamMember ~ isTeamMember",
      teamMember
    );

    if (!teamMember) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        "User not exists in company"
      );
    }

    // Set user role to admin in company
    user.role = role.Admin;
    const project = await Project.create({
      name: name,
      description: description,
      members: members,
      createdBy: user.id,
      company: company.id,
    });
    project.save();

    return project;
  } catch (error) {
    throw error;
  }
}

/**
 * Get company by id
 * @param {string} projectId
 * @returns {Promise<Project>}
 * @throws {Error}
 */
async function getById(projectId) {
  try {
    const project = await Project.findById(projectId);
    if (!project) throw "Company not found";
    return project;
  } catch (error) {
    throw error;
  }
}

/**
 * Get all projects
 * @returns {Promise<Project[]>}
 * @throws {Error}
 */

async function getAllProjects(companyId) {
  try {
    const isValidId = Mongoose.Types.ObjectId.isValid(companyId);
    if (!isValidId)
      throw new HttpException(HttpStatusCode.BAD_REQUEST, "Invalid company id");
    const projects = await Project.find({ company: companyId }).populate({
      path: "company",
      select: "name id",
    });
    if (!projects) throw "Projects not found";
    return projects;
  } catch (error) {
    throw error;
  }
}
