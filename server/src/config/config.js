const MONGO_URI =
  process.env.MONGO_URI || "mongodb://localhost:27017/react-kanban-db";

const API_PORT = process.env.API_PORT || 4000;

const TOKEN_KEY = process.env.TOKEN_KEY || "your-secret-token-key";

module.exports = {
  MONGO_URI,
  API_PORT,
  TOKEN_KEY,
};
