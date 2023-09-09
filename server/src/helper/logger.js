const chalk = require("chalk");

// Log error messages to the console
const logError = (error, label) => {
  // if (typeof message === "string") {
  //   console.log("🚨:", chalk.red(label || "Error"), chalk.blue(error));
  // } else {
  //   console.log("🚨:", chalk.red(label || "Error"), error);
  // }
  console.error("🚨:", chalk.red("[Error]"), chalk.blue(label || ""), error);
};

// Log success messages to the console
const logSuccess = (message, label) => {
  console.log(
    "✅:",
    chalk.green("[Success]"),
    chalk.greenBright(label || ""),
    message
  );
  // if (typeof message === "string") {
  //   console.log(
  //     "✅:",
  //     chalk.green("Success"),
  //     chalk.blue(label || ""),
  //     message
  //   );
  // } else {
  //   console.log(
  //     "✅:",
  //     chalk.green("Success"),
  //     chalk.blue(label || ""),
  //     message
  //   );
  // }
};

// Log info messages to the console
const logInfo = (message, label,initial = "📃 :") => {
  let i = "";
  if(initial && typeof initial === "number"){
    for(let j = 0; j < initial; j++){
      i += " ";
    }
  }
  console.info(`${i}`, chalk.dim("[Info]"), chalk.blue(label || ""), message);
  // if (typeof message === "string") {
  // } else {
  //   console.info("📃:", chalk.blue("Info"), message);
  // }
};

// Log warning messages to the console
const logWarning = (message, label) => {
  // if (typeof message === "string") {
  //   console.log("⚠️:", chalk.yellow("Warning"), chalk.blue(message));
  // } else {
  //   console.log("⚠️:", chalk.yellow("Warning"), message);
  // }
  console.warn(
    "⚠️:",
    chalk.yellow("[Warning]"),
    chalk.blue(label || ""),
    message
  );
};

// Log debug messages to the console
const logDebug = (message, label) => {
  // if (typeof message === "string") {
  //   console.log("🔍:", chalk.gray("Debug"), chalk.blue(message));
  // } else {
  //   console.log("🔍:", chalk.gray("Debug"), message);
  // }
  console.log("📃:", chalk.gray("[Debug]"), chalk.blue(label || ""), message);
};

// Log messages to the console
const log = (message) => {
  // if (typeof message === "string") {
  //   console.log("📝:", chalk.blue(message));
  // } else {
  //   console.log("📝:", message);
  // }
  console.log(chalk.gray("log"), message);
};

module.exports = {
  logError,
  logSuccess,
  logInfo,
  logWarning,
  logDebug,
  log,
};
