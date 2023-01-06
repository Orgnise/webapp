const Mongoose = require("mongoose");
const { Collection, Team } = require("../models");
const UserService = require("./user.service");

const {
  HttpStatusCode,
} = require("../helper/http-status-code/http-status-code");
const HttpException = require("../helper/exception/http-exception");
const { Admin } = require("../helper/role");
const { generateSlug } = require("../helper/slug-helper");
const { logInfo } = require("../helper/logger");

module.exports = {
  createCollection,
  getById,
  updateCollection,
  deleteCollection,
  getAllCollection,
};

/**
 * Create new collection/item and save to db
 * @param {Object} body - collection data
 * @returns {Promise<Collection>}
 * @throws {Error}
 */
async function createCollection(body) {
  try {
    const {
      workspaceId,
      title,
      index,
      teamId,
      userId,
      parent,
      content,
      object,
    } = body;

    // Get user data
    const user = await UserService.getById({ id: userId });

    // Generate slug for team
    const slug = await generateSlug({
      title,
      didExist: async (val) => {
        return await Collection.findOne({ "meta.slug": val });
      },
    });

    let parentCollection;
    if (parent) {
      parentCollection = await getById(parent);
    }

    const collection = await Collection.create({
      title: title,
      workspace: workspaceId,
      createdBy: user.id,
      parent: parent,
      content: content,
      lastUpdatedUserId: user.id,
      index: index,
      object: object,
      team: teamId,
      meta: {
        title: title,
        description: "",
        slug: slug,
      },
    });

    if (parentCollection) {
      const col = await Collection.findOneAndUpdate(
        { _id: parent },
        { $push: { children: collection._id } }
      );
      col.save();
      logInfo(
        `Item ${collection._id} added to ${parent} collection`,
        "createCollection"
      );
    }

    return collection;
  } catch (error) {
    throw new HttpException(
      error.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      error.message,
      error.error
    );
  }
}

/**
 * Update collection/item
 */
async function updateCollection(body) {
  try {
    const { id, content, title, parent } = body;

    const coll = await getById(id);
    if (coll.object === "collection" && content) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        "Collection can not have content"
      );
    }

    const collectionSlug = title + `-${id}`;

    // Generate slug for team
    const slug = await generateSlug({
      title: collectionSlug,
      didExist: async (val) => {
        return false;
      },
    });

    const filter = { _id: id };
    const update = {
      title: title,
      content: content,
      meta: {
        title: title,
        description: "",
        slug: slug,
      },
    };

    const collection = await Collection.findOneAndUpdate(filter, update);

    return getById(id);
  } catch (error) {
    throw new HttpException(
      error.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      error.message,
      error.error
    );
  }
}

/**
 * Get collection by id
 * @param {string} Id
 * @returns {Promise<Collection>}
 * @throws {HttpException}
 */
async function getById(id) {
  // Validate workspace id
  if (!Mongoose.isValidObjectId(id)) {
    throw new HttpException(HttpStatusCode.NOT_FOUND, "Invalid collection id");
  }

  // Get workspace from database if exists
  const collection = await Collection.findOne({ _id: id })
    .populate("createdBy", "name id")
    .populate("children", "title id")
    .populate("lastUpdatedUserId", "name id")
    .populate("team", "members");

  // Check if workspace exists in db
  if (!collection)
    throw new HttpException(
      HttpStatusCode.NOT_FOUND,
      "Item not found",
      "Item does not exists with id " + id
    );
  // Return workspace
  return collection;
}

/**
 * Delete collection/item by id
 */
async function deleteCollection(body) {
  try {
    const { id, userId } = body;
    const collection = await getById(id);

    // const hasPermission = isAllowed(userId, collection);
    if (collection.object === "collection") {
      // TODO: Delete all children items
    } else if (collection.object === "item") {
      if (collection.parent) {
        await Collection.findOneAndUpdate(
          { _id: collection.parent },
          { $pull: { children: collection._id } }
        );
        logInfo(
          `Item ${collection._id} removed from ${collection.parent}`,
          "deleteCollection"
        );
      }
    }
    await Collection.deleteOne({ _id: id });
    return collection;
  } catch (error) {
    throw new HttpException(
      error.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      error.message,
      error.error
    );
  }
}

/**
 * Get all collections/items
 * @param {Object} body
 * @returns {Promise<Collection[]>}
 */
async function getAllCollection(body) {
  try {
    const { workspaceId, teamId, parent, userId, object } = body;
    const filter = {
      workspace: workspaceId,
      team: teamId,
      parent: parent,
      object: object,
    };
    for (let key in filter) {
      if (
        !filter[key] ||
        filter[key] === "null" ||
        filter[key] === "undefined"
      ) {
        delete filter[key];
      }
    }
    // Get all collections from database using filter
    const collections = await Collection.find(filter)
      .populate("createdBy", "name id")
      .populate("children", "id title object parent content")
      .populate("lastUpdatedUserId", "name id")
      .populate("team", "members");

    return collections;
  } catch (error) {
    throw new HttpException(
      error.status || HttpStatusCode.INTERNAL_SERVER_ERROR,
      error.message,
      error.error
    );
  }
}

/**
 * Is user allowed to perform action
 * @param {string} userId
 * @param {Object} collection
 * @returns {boolean}
 */
function isAllowed(userId, collection) {
  // Check user data within team
  const members = collection.team.members;
  console.log(
    "🚀 ~ file:  collection.team ",
    Array.isArray(members),
    typeof members,
    members
  );

  const teamMember = members.find((member) => member.user._id == userId);

  // Check if user is a member of team
  if (!teamMember) {
    throw new HttpException(
      HttpStatusCode.FORBIDDEN,
      "You are not a member of the team",
      "Not allowed to perform this action"
    );
  }

  return true;
}
