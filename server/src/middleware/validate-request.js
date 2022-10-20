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
    next(
      `validation error: ${error.details.map((x) => x.toString()).join(", ")}`
    );
  } else {
    req.body = value;
    next();
  }
}
