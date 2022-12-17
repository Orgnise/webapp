const db = require("../config/db");
const { User, Organization, Project } = require("../models");
const FakeBoardData = require("../config/task_data");

const {
  HttpStatusCode,
} = require("../helper/http-status-code/http-status-code");
const HttpException = require("../helper/exception/http-exception");
const UserService = require("./user.service");
const CompanyService = require("./organization.service");
const role = require("../helper/role");
const Mongoose = require("mongoose");
const { generateSlug } = require("../helper/slug-helper");

module.exports = {
  getById,
  getBySlug,
  crateProject,
  addExamples,
  getAllProjects,
};

/**
 * create new task and save to db
 * @param {Object} taskBody
 * @returns {Promise<Project>}
 * @throws {HttpException}
 */
async function crateProject({ companyId, name, description, members, userId }) {
  try {
    // Get user
    const user = await UserService.getById({ id: userId });

    // Check if user exists in organization
    const organization = await CompanyService.getById(companyId);

    // Generate slug for organization
    const slug = await generateSlug({
      name,
      didExist: async (val) => {
        return await Project.findOne({ "meta.slug": val });
      },
    });

    // Check user data within organization
    const teamMember = organization.members.find((member) => {
      return member.user.id === userId;
    });

    // Check if user is a member of organization
    if (!teamMember) {
      throw new HttpException(
        HttpStatusCode.FORBIDDEN,
        "You are not a member of this organization",
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
      organization: organization.id,
      meta: {
        title: name,
        description: "",
        slug: slug,
      },
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
 * Add example projects to organization
 * @param {string} companyId
 * @param {string[]} examples
 * @returns {Promise<Project[]>}
 */
async function addExamples({ companyId, examples, userId }) {
  try {
    // Get user
    const user = await UserService.getById({ id: userId });

    // Check if user exists in organization
    const organization = await CompanyService.getById(companyId);

    // Set user role to admin for project
    user.role = role.Admin;

    let projects = [];
    let Promises = [];

    // Iterate through examples and create projects
    for (let i = 0; i < examples.length; i++) {
      let example = examples[i];
      const project = crateProject({
        companyId: organization.id,
        name: example,
        description: "Example project",
        members: [],
        userId: userId,
      });

      Promises.push(project);
    }

    //  Resolve all promises and push to projects array
    await Promise.all(Promises).then((values) => {
      projects.push(...values);
    });

    // return projects
    return projects;
  } catch (error) {
    throw error;
  }
}

/**
 * Get organization by id
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
 * Get organization by slug
 * @param {string} slug
 * @returns {Promise<Project>}
 * @throws {HttpException}
 */
async function getBySlug(slug) {
  if (!slug)
    throw new HttpException(HttpStatusCode.BAD_REQUEST, "Invalid slug");
  // Get project from database if exists
  const project = await Project.findOne({ "meta.slug": slug })
    .populate("members.user", "name email id")
    .populate("createdBy", "name id");
  // Check if project exists in db
  if (!project)
    throw new HttpException(
      HttpStatusCode.NOT_FOUND,
      "Project not found",
      "Project does not exists with slug - '" + slug + "'"
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
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        "Invalid organization id"
      );
    }

    // Get all projects of a organization from database if exists
    const projects = await Project.find({ organization: companyId })
      .populate("members.user", "name email id")
      .populate("createdBy", "name id");

    // Return all projects
    return projects;
  } catch (error) {
    throw error;
  }
}
