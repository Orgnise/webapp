const db = require("../config/db");
const { User, Team, Workspace } = require("../models");
const FakeBoardData = require("../config/task_data");

const {
  HttpStatusCode,
} = require("../helper/http-status-code/http-status-code");
const HttpException = require("../helper/exception/http-exception");
const UserService = require("./user.service");
const TeamService = require("./team.service");
const role = require("../helper/role");
const Mongoose = require("mongoose");
const { generateSlug } = require("../helper/slug-helper");

module.exports = {
  getById,
  getBySlug,
  crateWorkspace,
  addExamples,
  addExamplesBySlug,
  getAllWorkspace,
  getAllWorkspaceBySlug,
};

/**
 * create new task and save to db
 * @param {Object} taskBody
 * @returns {Promise<Workspace>}
 * @throws {HttpException}
 */
async function crateWorkspace({ orgId, name, description, members, userId }) {
  try {
    // Get user
    const user = await UserService.getById({ id: userId });

    // Check if user exists in team
    const team = await TeamService.getById(orgId);

    // Generate slug for team
    const slug = await generateSlug({
      title,
      didExist: async (val) => {
        return await Workspace.findOne({ "meta.slug": val });
      },
    });

    // Check user data within team
    const teamMember = team.members.find((member) => {
      return member.user.id === userId;
    });

    // Check if user is a member of team
    if (!teamMember) {
      throw new HttpException(
        HttpStatusCode.FORBIDDEN,
        "You are not a member of this team",
        "Not allowed to create workspace"
      );
    }

    // Set user role to admin for workspace
    user.role = role.Admin;
    const workspace = await Workspace.create({
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
      team: team.id,
      meta: {
        title: name,
        description: "",
        slug: slug,
      },
    });

    // Save workspace to database
    workspace.save();

    // return workspace
    return workspace;
  } catch (error) {
    throw error;
  }
}

/**
 * Add example workspaces to team
 * @param {string} orgId
 * @param {string[]} examples
 * @returns {Promise<Workspace[]>}
 */
async function addExamples({ orgId, examples, userId }) {
  try {
    // Get user
    const user = await UserService.getById({ id: userId });

    // Check if user exists in team
    const team = await TeamService.getById(orgId);

    // Set user role to admin for workspace
    user.role = role.Admin;

    let workspaces = [];
    let Promises = [];

    // Iterate through examples and create workspaces
    for (let i = 0; i < examples.length; i++) {
      let example = examples[i];
      const workspace = crateWorkspace({
        orgId: team.id,
        name: example,
        description: "Example workspace",
        members: [],
        userId: userId,
      });

      Promises.push(workspace);
    }

    //  Resolve all promises and push to workspaces array
    await Promise.all(Promises).then((values) => {
      workspaces.push(...values);
    });

    // return workspaces
    return workspaces;
  } catch (error) {
    throw error;
  }
}

/**
 * Add example workspaces to team using team slug
 * @param {string} slug
 * @param {string[]} examples
 * @returns {Promise<Workspace[]>}
 */
async function addExamplesBySlug({ slug, examples, userId }) {
  try {
    // Check if user exists in team
    const team = await TeamService.getBySlug(slug);

    const workspaces = await addExamples({
      orgId: team.id,
      examples: examples,
      userId: userId,
    });

    // return workspaces
    return workspaces;
  } catch (error) {
    throw error;
  }
}

/**
 * Get team by id
 * @param {string} workspaceId
 * @returns {Promise<Workspace>}
 * @throws {HttpException}
 */
async function getById(workspaceId) {
  // Validate workspace id
  if (!Mongoose.isValidObjectId(workspaceId)) {
    throw new HttpException(HttpStatusCode.NOT_FOUND, "Invalid workspace id");
  }

  // Get workspace from database if exists
  const workspace = await Workspace.findOne({ _id: workspaceId })
    .populate("members.user", "name email id")
    .populate("createdBy", "name id");

  // Check if workspace exists in db
  if (!workspace)
    throw new HttpException(
      HttpStatusCode.NOT_FOUND,
      "Workspace not found",
      "Workspace does not exists with id '" + workspaceId + "'"
    );
  // Return workspace
  return workspace;
}

/**
 * Get team by slug
 * @param {string} slug
 * @returns {Promise<Workspace>}
 * @throws {HttpException}
 */
async function getBySlug(slug) {
  if (!slug)
    throw new HttpException(HttpStatusCode.BAD_REQUEST, "Invalid slug");
  // Get workspace from database if exists
  const workspace = await Workspace.findOne({ "meta.slug": slug })
    .populate("members.user", "name email id")
    .populate("createdBy", "name id");
  // Check if workspace exists in db
  if (!workspace)
    throw new HttpException(
      HttpStatusCode.NOT_FOUND,
      "Workspace not found",
      "Workspace does not exists with slug - '" + slug + "'"
    );
  // Return workspace
  return workspace;
}

/**
 * Get all workspaces
 * @param {string} orgId
 * @returns {Promise<Workspace[]>}
 * @throws {HttpException}
 */

async function getAllWorkspace(orgId) {
  try {
    // Check if orgId is valid object id
    if (!Mongoose.isValidObjectId(orgId)) {
      throw new HttpException(HttpStatusCode.BAD_REQUEST, "Invalid team id");
    }

    // Get all workspaces of a team from database if exists
    const workspaces = await Workspace.find({ team: orgId })
      .populate("members.user", "name email id")
      .populate("createdBy", "name id");

    // Return all workspaces
    return workspaces;
  } catch (error) {
    throw error;
  }
}

/**
 * Get all workspaces using team slug
 * @param {string} slug
 * @returns {Promise<Workspace[]>}
 * @throws {HttpException}
 */
async function getAllWorkspaceBySlug(slug) {
  try {
    if (!slug)
      throw new HttpException(HttpStatusCode.BAD_REQUEST, "Invalid slug");
    const team = await TeamService.getBySlug(slug);
    if (!team) {
      throw new HttpException(
        HttpStatusCode.NOT_FOUND,
        "Team not found",
        "Team does not exists with slug - '" + slug + "'"
      );
    }

    // Get all workspaces of a team from database if exists
    const workspaces = await getAllWorkspace(team.id);

    // Return all workspaces
    return workspaces;
  } catch (error) {
    throw error;
  }
}
