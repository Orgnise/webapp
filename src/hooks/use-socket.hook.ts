// Socket hook

import { useEffect, useContext } from "react";
import { Socket } from "socket.io-client";
import { SocketContext } from "../provider/socket.provider";


/**
 * Socket hook to listen for multiple events and update state
 * @param {string[]} events
 * @param {Object} initialState
 * @returns
 * @example
 * const [state, setState] = useSocket(["event1", "event2"], (event,data) => {console.log(event, data)});
 * setState({ event1: "new value" });
 */
const useSocket = (events: string[], callback = (event: string, data: (_: any) => void) => { }): Socket => {

  const socket = useContext<any>(SocketContext);

  useEffect(() => {
    if (events && events.length > 0) {

      events.forEach((event) => {
        socket.on(event, (data: any) => {
          console.log("Socket event", event, data);
          // setState((prevState: any) => ({ ...prevState, [event]: data }));
          callback(event, data);
        });
      });
      return () => {
        events.forEach((event) => {
          socket.off(event);
        });
      };
    }
    return () => { };
  }, [events, socket]);

  return socket;
}

export default useSocket;