const chalk = require("chalk");

// Log error messages to the console
const logError = (error, label) => {
  if (typeof message === "string") {
    console.log("🚨:", chalk.red(label || "Error"), chalk.blue(error));
  } else {
    console.log("🚨:", chalk.red(label || "Error"), error);
  }
};

// Log success messages to the console
const logSuccess = (message) => {
  console.log("🌟:", chalk.green("Success"), chalk.blue(message));
};

// Log info messages to the console
const logInfo = (message) => {
  if (typeof message === "string") {
    console.info("📃:", chalk.blue("Info"), chalk.blue(message));
  } else {
    console.info("📃:", chalk.blue("Info"), message);
  }
};

// Log warning messages to the console
const logWarning = (message) => {
  if (typeof message === "string") {
    console.log("⚠️:", chalk.yellow("Warning"), chalk.blue(message));
  } else {
    console.log("⚠️:", chalk.yellow("Warning"), message);
  }
};

// Log debug messages to the console
const logDebug = (message) => {
  if (typeof message === "string") {
    console.log("🔍:", chalk.gray("Debug"), chalk.blue(message));
  } else {
    console.log("🔍:", chalk.gray("Debug"), message);
  }
};

// Log messages to the console
const log = (message) => {
  if (typeof message === "string") {
    console.log("📝:", chalk.blue(message));
  } else {
    console.log("📝:", message);
  }
};

module.exports = {
  logError,
  logSuccess,
  logInfo,
  logWarning,
  logDebug,
  log,
};
