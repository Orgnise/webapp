import { io } from "socket.io-client";

const socketURL = process.env.REACT_APP_SOCKET_URL || "http://localhost:3000";
const socket = io(socketURL);

export default socket;
