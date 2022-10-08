// Socket hook

import { useState, useEffect, useContext, Dispatch } from "react";
import { Socket } from "socket.io-client";
import { SocketContext } from "../context/socket.context";


/**
 * Socket hook to listen for multiple events and update state
 * @param {string[]} events
 * @param {Object} initialState
 * @returns
 * @example
 * const [state, setState] = useSocket(["event1", "event2"], { event1: null, event2: null });
 * setState({ event1: "new value" });
 * @example <caption>Second way of updating data</caption>
 * const [state, setState] = useSocket(["event1", "event2"], { event1: null, event2: null });
 * setState((prevState) => ({ ...prevState, event1: "New data" }));
 */
const useSocket = (events: string[], initialState: any): [Object, Dispatch<any>, Socket] => {

  const [state, setState] = useState(initialState);
  const socket = useContext<any>(SocketContext);

  useEffect(() => {
    if (events && events.length > 0) {

      events.forEach((event) => {
        socket.on(event, (data: any) => {
          setState((prevState: any) => ({ ...prevState, [event]: data }));
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

  return [state, setState, socket];
}

export default useSocket;