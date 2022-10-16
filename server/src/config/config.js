const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/your-database-name";

const API_PORT = process.envAPI_PORT || 4000;

module.exports = {
  MONGO_URI,
  API_PORT,
};
