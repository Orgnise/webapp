const swaggerJsdoc = require("swagger-jsdoc");
const { API_PORT } = require("./config");

// Swagger definition
// You can set every attribute except paths and swagger
// https://github.com/swagger-api/swagger-spec/blob/master/versions/2.0.md
const swaggerDefinition = {
  info: {
    title: "React Kanban API Documentation", // Title (required)
    version: "1.0.0", // Version (required)
    description: "This is a documentation for the React Kanban API", // Description (optional)
  },
  // servers: [
  //   {
  //     url: `http://localhost:${API_PORT}`,
  //     description: "Development server",
  //   },
  // ],
  host: `localhost:${API_PORT}`, // Host (optional)
  basePath: "/", // Base path (optional)
  securityDefinitions: {
    BasicAuth: {
      type: "http",
      scheme: "basic",
    },
    BearerAuth: {
      type: "http",
      scheme: "bearer",
      bearerFormat: "JWT",
    },
  },
  security: {
    BasicAuth: [],
    BearerAuth: [],
  },
  tags: [
    // {
    //   name: "Board",
    //   description: "Board related endpoints",
    //   externalDocs: {
    //     description: "Find out more",
    //   },
    // },
  ],
};

// Options for the swagger docs
const options = {
  // Import swaggerDefinitions
  swaggerDefinition,
  // Path to the API docs
  // Note that this path is relative to the current directory from which the Node.js is ran, not the application itself.
  apis: ["./src/routes/*.js"],
};

// Initialize swagger-jsdoc -> returns validated swagger spec in json format
const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;
