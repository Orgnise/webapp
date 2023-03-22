const MONGO_URI = process.env.MONGO_URI ?? "mongodb://localhost:27017/pulse-db";

const API_PORT = process.env.PORT || 3000;

const TOKEN_KEY = process.env.TOKEN_KEY || "your-secret-token-key";


const SOCKET_URL = process.env.SOCKET_URL || `http://localhost:4000`;

module.exports = {
  MONGO_URI,
  API_PORT,
  TOKEN_KEY,
  SOCKET_URL,
};
