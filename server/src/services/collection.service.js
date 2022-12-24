const Mongoose = require("mongoose");
const { Collection } = require("../models");
const UserService = require("./user.service");

const {
  HttpStatusCode,
} = require("../helper/http-status-code/http-status-code");
const HttpException = require("../helper/exception/http-exception");
const { Admin } = require("../helper/role");
const { generateSlug } = require("../helper/slug-helper");

module.exports = {
  createCollection,
  getById,
  updateCollection,
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
      parentId,
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

    if (parentId) {
      await getById(parentId);
    }

    const collection = await Collection.create({
      title: title,
      workspace: workspaceId,
      createdBy: user.id,
      parentId: parentId,
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
    const { id, content, title } = body;

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
  const collection = await Collection.findOne({ _id: id }).populate(
    "createdBy",
    "name id"
  );

  // Check if workspace exists in db
  if (!collection)
    throw new HttpException(
      HttpStatusCode.NOT_FOUND,
      "Collection not found",
      "Collection does not exists with id '" + id + "'"
    );
  // Return workspace
  return collection;
}
