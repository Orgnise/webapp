global.env = function (property = "", fallback = null) {
  if (typeof property == "string" && property.length > 0) {
    return process.env[property];
  } else {
    return fallback;
  }
};

global.__globals = {
  permissions: [],
};
