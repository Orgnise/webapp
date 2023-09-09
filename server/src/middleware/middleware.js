const chalk = require("chalk");

module.exports = function (options) {
  return function (req, res, next) {
    if(req.method === "DELETE"){
      console.log("\n🔥 :", chalk.red(`[${req.method}]`), chalk.blue(req.path));
    }else if(req.method === "POST"){
      console.log("\n📝 :", chalk.yellow(`[${req.method}]`), chalk.blue(req.path));
    }else if(req.method === "GET"){
      console.log("\n📄 :", chalk.green(`[${req.method}]`), chalk.blue(req.path));
    }
    next();
  };
};
