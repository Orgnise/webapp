const MONGO_URI = process.env.REACT_APP_MONGO_URI || "mongodb://localhost:27017/pulse-db";

const API_PORT = process.env.REACT_APP_PORT || 3000;

const TOKEN_KEY = process.env.REACT_APP_TOKEN_KEY || "your-secret-token-key";


const SOCKET_URL = process.env.REACT_APP_SOCKET_URL || `http://localhost:4000`;

module.exports = {
  MONGO_URI,
  API_PORT,
  TOKEN_KEY,
  SOCKET_URL,
};
