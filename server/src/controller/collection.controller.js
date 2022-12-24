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
router.put("/items/:id", authorize(), validateItemSchema, updateCollection);
router.get("/items/:id", authorize(), getCollection);
router.delete("/items/:id", authorize(), deleteCollection);

function validateItemSchema(req, res, next) {
  const schema = Joi.object({
    teamId: Joi.string().required(),
    workspaceId: Joi.string(),
    parentId: Joi.string(),
    object: Joi.string().default("item"),
    title: Joi.string().optional(),
    content: Joi.string(),
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
  const { workspaceId, title, index, teamId, parentId, content, object } = data;

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
    if (!parentId) {
      throw new HttpException(
        HttpStatusCode.BAD_REQUEST,
        "ParentId is required",
        object
      );
    }
    const item = {
      title,
      index,
      teamId,
      parentId,
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

module.exports = router;
