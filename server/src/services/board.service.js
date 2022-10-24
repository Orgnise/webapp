const db = require("../config/db");
const User = require("../models/user");
const RefreshToken = require("../models/refresh-token.model");
const FakeBoardData = require("../config/task_data");

const {
  HttpStatusCode,
} = require("../helper/http-status-code/http-status-code");
const HttpException = require("../helper/exception/http-exception");

module.exports = {
  getById,
};

async function getById(id) {
  //   const board = await Board.findById(id);
  //   if (!board) throw "Board not found";
  //   return board;
  if (!id) {
    throw new HttpException(HttpStatusCode.NOT_FOUND, "Board not found");
  } else {
    const faker = new FakeBoardData();
    return faker.tasks;
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
