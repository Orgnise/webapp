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
  updateItemParent,
  deleteAllCollection,
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
 * Update item's parent
 */
async function updateItemParent(body){
  try {
    const { workspaceId, index, teamId, newParent, id, user} = body;

    // Get item
    const item = await getById(id,false);

    // Get new parent
    const newParentCollection = await getById(newParent);

    // const oldParentCollection = await getById(item.parent)

    // TODO: Check if user has access to update item

    const filter = { _id: id };

    const update = {
      parent:newParent,
      lastUpdatedUserId:user.id
    };

    // Replace old parent with new parent
    const updatedItem = await Collection.findOneAndUpdate(filter, update);
    // console.log("🚀 ~ file: collection.service.js:162 ~ updateItemParent ~ updatedItem", updatedItem)

    // Remove item from the old parent children list
    const oldCollection = await Collection.findOneAndUpdate({_id:item.parent},{ $pull: { children: id } });
    // console.log("🚀 ~ file: collection.service.js:167 ~ updateItemParent ~ oldCollection", oldCollection)


    // Add item to the new parent children list
    const newCollection = await Collection.findOneAndUpdate({_id:newParent},{ $push: { children: id } });


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
async function getById(id,isCollection = true) {
  // Validate workspace id
  if (!Mongoose.isValidObjectId(id)) {
    const error = `Invalid ${isCollection ? 'collection': 'item'} id`;
    throw new HttpException(HttpStatusCode.NOT_FOUND,'Collection not found', error);
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
      `${isCollection ? 'collection': 'item'} not found`,
      `${isCollection ? 'collection': 'item'} does not exists with id ` + id
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
 * Delete all collections/items of a workspace
 * @param {string} workspaceId
 * @returns {Promise<boolean>}
 */
async function deleteAllCollection(workspaceId) {
  try {
    // Get all collections of a workspace from database if exists
    const collections = await getAllCollection(workspaceId);

    // Delete all collections from database
    await Collection.deleteMany({ workspace: workspaceId });

    // Return all collections
    return true;
  } catch (error) {
    throw error;
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
