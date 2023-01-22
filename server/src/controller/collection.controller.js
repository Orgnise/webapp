const express = require("express");
const router = express.Router();
const Joi = require("joi");
const ValidationRequest = require("../middleware/validate-request");
const authorize = require("../middleware/authorize");
const { CollectionService } = require("../services/index");
const ApiResponseHandler = require("../helper/response/api-response");
const HttpStatusCode = require("../helper/http-status-code/http-status-code");
const HttpException = require("../helper/exception/http-exception");

// routes
router.post("/items", authorize(), validateItemSchema, createCollection);
router.get("/items", authorize(), getAllCollection);
router.put("/items/:id", authorize(), validateItemSchema, updateCollection);
router.put("/items/:id/update-parent", authorize(), validateUpdateParentSchema, updateItemParent);
router.get("/items/:id", authorize(), getCollection);
router.delete("/items/:id", authorize(), deleteCollection);

function validateItemSchema(req, res, next) {
  const schema = Joi.object({
    teamId: Joi.string().required(),
    workspaceId: Joi.string(),
    parent: Joi.string(),
    object: Joi.string().default("item"),
    title: Joi.string().optional(),
    content: Joi.object().optional(),
    index: Joi.number(),
  });
  ValidationRequest(req, next, schema);
}

function validateUpdateParentSchema(req, res, next) {
  const schema = Joi.object({
    teamId: Joi.string().required(),
    workspaceId: Joi.string().required(),
    parent: Joi.string().required(),
    index: Joi.number(),
  });
  ValidationRequest(req, next, schema);
}

/**
 * Create new collection/item
 */
function createCollection(req, res, next) {
  const data = req.body;
  const user = req.auth;
  const { workspaceId, title, index, teamId, parent, content, object } = data;

  if (object === "collection") {
    if (!workspaceId) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        "WorkspaceId is required"
      );
    } else if (content) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        "Content is not allowed"
      );
    }
    const collection = {
      workspaceId,
      title,
      index,
      teamId,
      object,
      userId: user.id,
    };

    CollectionService.createCollection(collection)
      .then((collection) => {
        return ApiResponseHandler.success({
          res: res,
          data: collection,
          message: "Collection created successfully",
          dataKey: "item",
          status: HttpStatusCode.OK,
        });
      })
      .catch(next);
  } else {
    if (!parent) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        "Parent is required",
        object
      );
    }
    const item = {
      title,
      index,
      teamId,
      parent,
      workspaceId,
      content,
      object: "item",
      userId: user.id,
    };

    CollectionService.createCollection(item)
      .then((collection) => {
        return ApiResponseHandler.success({
          res: res,
          data: collection,
          message: "Item created successfully",
          dataKey: "item",
          status: HttpStatusCode.OK,
        });
      })
      .catch(next);
  }
}

/**
 * Update collection/item
 */
function updateCollection(req, res, next) {
  const id = req.params.id;
  const data = req.body;
  //   const user = req.auth;
  const { title, content } = data;

  if (!title && !content) {
    throw new HttpException(
      HttpStatusCode.BAD_REQUEST,
      "title or content is required"
    );
  }
  const item = {
    title,
    content,
    id,
  };

  CollectionService.updateCollection(item)
    .then((collection) => {
      return ApiResponseHandler.success({
        res: res,
        data: collection,
        message: "Item updated successfully",
        dataKey: "item",
        status: HttpStatusCode.OK,
      });
    })
    .catch(next);
}

/**
 * Update collection/item parent. This is used to move item from one collection to another
 */
function updateItemParent(req, res, next) {
  const id = req.params.id;
  const data = req.body;
  const user = req.auth;
  const { workspaceId, index, teamId, parent } = data;

  const payload = {workspaceId, index, teamId, newParent: parent, id, user};

  CollectionService.updateItemParent(payload)
    .then((collection) => {
      return ApiResponseHandler.success({
        res: res,
        data: collection,
        message: "Item updated successfully",
        dataKey: "item",
        status: HttpStatusCode.OK,
      });
    })
    .catch(next);
}

/**
 * Get collection/item by id
 */

function getCollection(req, res, next) {
  const id = req.params.id;

  CollectionService.getById(id)
    .then((collection) => {
      if (!collection) {
        throw new HttpException(
          HttpStatusCode.NOT_FOUND,
          "Collection not found"
        );
      }
      return ApiResponseHandler.success({
        res: res,
        data: collection,
        message: `${
          collection.object == "collection" ? "Collection" : "Object"
        } fetched successfully`,
        dataKey: "item",
        status: HttpStatusCode.OK,
      });
    })
    .catch(next);
}

/**
 * Delete collection/item by id
 */
function deleteCollection(req, res, next) {
  const id = req.params.id;
  const userId = req.auth.id;

  CollectionService.deleteCollection({ userId, id })
    .then((collection) => {
      return ApiResponseHandler.success({
        res: res,
        data: {
          id: collection.id,
        },
        message: `${
          collection.object == "collection" ? "Collection" : "Object"
        } deleted successfully`,
        dataKey: "item",
        status: HttpStatusCode.OK,
      });
    })
    .catch(next);
}

/**
 * Get all collections
 */
function getAllCollection(req, res, next) {
  const userId = req.auth.id;
  const { workspaceId, object, limit, query, parent, teamId } = req.query;
  const filter = {
    userId,
    workspaceId,
    object,
    limit,
    query,
    parent,
    teamId,
  };

  CollectionService.getAllCollection(filter)
    .then((collections) => {
      return ApiResponseHandler.success({
        res: res,
        data: collections,
        message: "Collections fetched successfully",
        dataKey: "items",
        status: HttpStatusCode.OK,
        total: collections.length,
      });
    })
    .catch(next);
}

module.exports = router;
