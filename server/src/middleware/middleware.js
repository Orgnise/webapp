module.exports = function(options) {
  return function(req, res, next) {
    console.log("Time: ", new Date().toUTCString());
    next();
  };
};
