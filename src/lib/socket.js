import socketIO from "socket.io-client";

const socket = socketIO(`http://${window.location.hostname}:4000`);
export default socket;
