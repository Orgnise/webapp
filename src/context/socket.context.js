import React, { createContext } from "react";
import socket from "../lib/socket";

const SocketContext = createContext(null);
SocketContext.displayName = "SocketContext";

export { SocketContext };

export default ({ children }) => {
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const withSocket = (Component) => (props) =>
  (
    <SocketContext.Consumer>
      {(socket) => <Component socket={socket} {...props} />}
    </SocketContext.Consumer>
  );
