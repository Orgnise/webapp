const Mongoose = require("mongoose");
const db = require("../config/db");
const { promise: fs } = require("fs");
const { User, Team } = require("../models");
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
  createTeam,
  getAllTeam,
  addMembers,
  removeMembers,
  getJoinedTeams,
};

/**
 * Create new team and save to db
 * @param {Object} body - team data
 * @returns {Promise<Team>}
 * @throws {Error}
 */
async function createTeam(body, userId) {
  try {
    const { name, description, createdBy } = body;

    // Check if team already exists with same name
    if (await Team.findOne({ name })) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        "Team already exists"
      );
    }

    // Get user data
    const user = await UserService.getById({ id: userId });

    // Generate slug for team
    const slug = await generateSlug({
      title: name,
      didExist: async (val) => {
        return await Team.findOne({ "meta.slug": val });
      },
    });

    // Set user role to admin for team
    user.role = Admin;
    const team = await Team.create({
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

    // return team data
    return (await team.populate("members.user", "name id")).populate(
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
 * Get team by id
 * @param {ObjectId} orgId
 * @throws {Error}
 */
async function getById(orgId) {
  // Check if id is a valid team id
  if (!Mongoose.isValidObjectId(orgId)) {
    throw new HttpException(HttpStatusCode.BAD_REQUEST, "", "Invalid team id");
  }
  // Get team data using team id if exists
  const team = await Team.findOne({ _id: orgId })
    .populate("members.user", "name email id")
    .populate("createdBy", "name id");

  // Check if team exists
  if (!team) {
    throw new HttpException(
      HttpStatusCode.NOT_FOUND,
      "No team found with",
      "Team does not exist with " + orgId + " id"
    );
  }

  return getBasicTeamInfo(team);
}

/**
 * Get team by slug
 * @param {String} slug
 * @returns {Promise<Team>}
 * @throws {Error}
 */
async function getBySlug(slug) {
  if (!slug)
    throw new HttpException(HttpStatusCode.BAD_REQUEST, "Invalid slug");

  // Get team data using team id if exists
  const team = await Team.findOne({ "meta.slug": slug })
    .populate("members.user", "name email id")
    .populate("createdBy", "name id");

  // Check if team exists
  if (!team) {
    throw new HttpException(
      HttpStatusCode.NOT_FOUND,
      "No team found",
      "Team does not exist with slug: " + slug
    );
  }

  return getBasicTeamInfo(team);
}

/**
 * Get all team basic info for user
 * @param {ObjectId} userId
 * @returns {Promise<Team[]>}
 * @throws {HttpException}
 */

async function getAllTeam(userId) {
  if (!userId) {
    throw new HttpException(
      HttpStatusCode.UNPROCESSABLE_ENTITY,
      "userId cannot be empty or null",
      "userId is required"
    );
  }
  try {
    const teams = await Team.find({
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
    return teams;
  } catch (error) {
    throw new HttpException(
      HttpStatusCode.INTERNAL_SERVER_ERROR,
      "",
      error.message
    );
  }
}

/**
 * Gel all joined teams
 * @param {ObjectId} userId
 * @returns {Promise<Team[]>}
 * @throws {HttpException}
 */
async function getJoinedTeams(userId) {
  try {
    const user = await UserService.getById({ id: userId });
    const teams = await Team.find({ "members.user": user.id })
      .populate("members.user", "name")
      .populate("createdBy", "name");
    return teams;
  } catch (error) {
    throw error;
  }
}

/**
 * Add members to team
 * @param {ObjectId} orgId
 * @param {Array} members
 * @param {ObjectId} userId
 * @returns {Promise<Team>}
 * @throws {Error}
 */

async function addMembers(orgId, userId, members) {
  try {
    // Check if team exists
    const team = await findTeam(orgId);

    const user = team.members.find((member) => member.user._id == userId);

    // Check if auth user is a member of team or not, if he/she is not team owner
    if (team.createdBy.id !== userId) {
      // Check if user is member of team
      if (!user) {
        throw new HttpException(
          HttpStatusCode.FORBIDDEN,
          "You are not a member of this team",
          "Not authorized to add members"
        );
      } else if (user.role !== Role.Admin) {
        throw new HttpException(
          HttpStatusCode.FORBIDDEN,
          "You are not a allowed to add member in this team, Only admin can add members",
          "Not authorized to add members"
        );
      }
    }

    // Add members to team
    const newMembers = members.map((member) => ({
      user: member.id,
      role: member.role,
      _id: member.id,
    }));

    // Check is user already exists in team
    const existingMembers = team.members.filter((member) =>
      newMembers.find((newMember) => newMember.user == member.user._id)
    );

    // Throw error if trying to add existingMembers
    if (existingMembers.length > 0) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        `${existingMembers.length} of ${newMembers.length} users already exists in team`,
        existingMembers.map((member) => {
          return {
            id: member.user._id,
            role: member.role,
          };
        })
      );
    }

    team.members = [...team.members, ...newMembers];

    await team.save();

    return findTeam(orgId);
  } catch (error) {
    throw error;
  }
}

/**
 * Get team complete info
 */
async function findTeam(orgId) {
  if (!Mongoose.isValidObjectId(orgId)) {
    throw new HttpException(HttpStatusCode.BAD_REQUEST, "Invalid team id");
  }
  const team = await Team.findOne({ _id: orgId })
    .populate("members.user", "name")
    .populate("createdBy", "name");
  if (!team || team === null) {
    throw new HttpException(
      HttpStatusCode.NOT_FOUND,
      "Team not found",
      "Team not found with id " + orgId
    );
  }
  return team;
}

/**
 * Remove members from a team
 * @param {ObjectId} orgId
 * @param {Array} members
 * @param {ObjectId} userId
 * @return {Promise<Team>}
 * @throws {Error}
 */
async function removeMembers(orgId, userId, members) {
  try {
    // get team data if exists
    const team = await findTeam(orgId);

    // Get current auth user from team if exists
    const user = team.members.find((member) => member.user._id == userId);

    // No need to verify if team owner is a member or not
    if (userId !== team.createdBy.id) {
      // Check if current auth user is member of team
      if (!user) {
        throw new HttpException(
          HttpStatusCode.FORBIDDEN,
          "You are not a member of this team",
          "Not authorized to remove members"
        );
      }
      // Check if current auth user is team admin or not
      else if (user.role !== Role.Admin) {
        throw new HttpException(
          HttpStatusCode.FORBIDDEN,
          "You are not a allowed to remove member in this team, Only admin can remove members",
          "Not authorized to remove members"
        );
      }
    }

    // Filter out remaining members
    const remainingMembers = team.members.filter((member) => {
      return !members.includes(member.id);
    });

    // Update team members
    team.members = remainingMembers;

    // Save team
    await team.save();

    return team;
  } catch (error) {
    throw error;
  }
}

// Helper functions

/**
 * Get basic team info
 * @param {Team} team
 */
function getBasicTeamInfo(team) {
  return {
    id: team.id,
    name: team.name,
    description: team.description,
    members: team.members,
    createdBy: team.createdBy,
    meta: team.meta,
  };
}
