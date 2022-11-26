const { fromCache } = require("../helper/redis/redis-client");
const ApiResponseHandler = require("../helper/response/api-response");
const {
  HttpStatusCode,
} = require("../helper/http-status-code/http-status-code");

/**
 * Middleware to check if the data is in the cache.
 * If it is, return the data from the cache.
 * If it is not, call the next middleware.
 * @param {String} keyPath - The key to get the data from the cache
 */
module.exports = function cacheMiddleWare({
  keyPath,
  cacheDataKey,
  cacheDataMessage,
}) {
  return [
    async (req, res, next) => {
      if (keyPath && false) {
        // convert the key to list of keys
        const keys = keyPath.split(".");

        // Get the key from the request using keyPath.
        // For example, if the keyPath is "params.id", then the key will value available at req.params.id
        // If the keyPath is "body.name", then the key will value be available at req.body.name
        const key = getLeaf(req, keyPath);
        if (key) {
          const cacheResults = await fromCache(key);

          if (cacheResults) {
            return ApiResponseHandler.success({
              res: res,
              data: JSON.parse(cacheResults),
              message: cacheDataMessage || "Data fetched successfully",
              dataKey: cacheDataKey,
              status: HttpStatusCode.OK,
              isCached: true,
            });
          }
        }
      }

      next();
    },
  ];
};

/**
 * Get the value from the object using the path
  @param {Object} obj
  @param {String} path
  @returns {String} 
  */
function getLeaf(node, path) {
  if (node) {
    const keys = path.split(".");
    for (let i = 0; i < keys.length; i++) {
      node = node[keys[i]];
    }
    return node;
  }
}
