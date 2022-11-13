const chalk = require("chalk");
const redis = require("redis");
const { logError, logInfo } = require("../logger");
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

(async () => {
  redisClient.on("error", async (error) => {
    logError(error, "Redis client error");
    await redisClient.disconnect();
    logInfo("Redis client disconnected");
  });
  redisClient.on("connect", function () {
    console.log(
      "💾",
      chalk.blue("[Redis]"),
      chalk.green("Redis client connected")
    );
  });
  await redisClient.connect();
})();

/**
 * Get the value from redis cache
 * @param {String} key
 * @returns {Promise<String | null>}
 */
const fromCache = async (key) => {
  const data = await redisClient.get(key);
  return data;
};

/**
 * Save the value in redis cache
 * @param {String} key
 * @param {any} value
 * @param {Object} option
 * @returns {Promise<String | null>}
 */
const SaveToCache = async (key, value, option) => {
  if (!value) {
    return null;
  } else if (value !== "string") {
    value = JSON.stringify(value);
  }
  if (!option) {
    option = {
      EX: 60 * 60 * 1000,
      NX: true,
    };
  }
  const data = await redisClient.set(key, value, option);
  return data;
};

/**
 * Save the value to redis cache. If the key already exists, then update the value
 * @param {String} key
 * @param {any} value
 * @param {Object} option
 * @returns {Promise<String | null>}
 */

const updateCache = async (key, value, option) => {
  if (!value) {
    return null;
  } else if (value !== "string") {
    value = JSON.stringify(value);
  }
  if (!option) {
    option = {
      EX: 60 * 60 * 1000,
      NX: true,
    };
  }
  const data = await redisClient.set(key, value, option);

  return data;
};

/**
 * Delete the value from redis cache
 * @param {String} key
 * @returns {Promise<number>}
 */
const invalidateCache = async (key) => {
  if (key) {
    const data = await redisClient.del(key);

    return data;
  } else {
    return 0;
  }
};

module.exports = {
  fromCache,
  SaveToCache,
  updateCache,
  invalidateCache,
};
