var _ = require("lodash");

module.exports = validateRequest;

// Validate Request Middleware
function validateRequest(req, next, schema) {
  const options = {
    abortEarly: false, // include all errors
    allowUnknown: true, // ignore unknown props
    stripUnknown: true, // remove unknown props
  };

  const { error, value } = schema.validate(req.body, options);
  if (error) {
    const JoiError = {
      status: 422,
      message: "Invalid request data. Please review request and try again.",
      error: error.details.map((x) => {
        const key = x.path[0];
        return {
          [key]: x.message.replace(/['"]/g, ""),
        };
      }),
    };

    next(JoiError);
  } else {
    req.body = value;
    next();
  }
}
