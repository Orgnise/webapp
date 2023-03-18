import socketIO from "socket.io-client";

const socketURL = process.env.REACT_APP_SOCKET_URL || "http://localhost:3000";
const socket = socketIO(socketURL);
export default socket;
