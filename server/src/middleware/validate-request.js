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
    // next(`Validation error: ${error.details.map((x) => x.message).join(", ")}`);
    // next({
    //   name: "ValidationError",
    //   code: "VALIDATION_ERROR",
    //   status: 400,
    //   message: error.details.map((x) => x.message).join(", "),
    // });
    // Joi Error
    console.log(error);
    const JoiError = {
      status: "failed",
      status: 422,
      message: "Invalid request data. Please review request and try again.",
      error: error.details.map((x) => {
        const key = x.path[0];
        return {
          [key]: x.message.replace(/['"]/g, ""),
        };
      }),
    };

    // Custom Error
    const CustomError = {
      code: "ValidationError",
      states: 422,
      error: "Invalid request data. Please review request and try again.",
    };

    next(JoiError);
  } else {
    req.body = value;
    next();
  }
}
