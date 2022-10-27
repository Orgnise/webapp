const db = require("../config/db");
const { User, Company } = require("../models");
const FakeBoardData = require("../config/task_data");

const {
  HttpStatusCode,
} = require("../helper/http-status-code/http-status-code");
const HttpException = require("../helper/exception/http-exception");

module.exports = {
  getById,
  crateTask,
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
async function crateTask({ taskBody }) {
  try {
    // const task = await Task.create(taskBody);
    // return task;
  } catch (error) {
    throw error;
  }
}
