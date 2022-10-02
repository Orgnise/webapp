import React, { useState, useEffect } from "react";
import "./style/App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Comments from "./pages/comments";
import Task from "./pages/task";
import Login from "./pages/login";
import socketIO from "socket.io-client";

/*
👇🏻  Pass Socket.io into the required components
    where communications are made with the server
*/

export const socket = socketIO(`http://${window.location.hostname}:4000`);

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [lastPong, setLastPong] = useState(null);

  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!socket || !socket.connected) return;
    socket.on("connect", () => {
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("pong", () => {
      setLastPong(new Date().toISOString());
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("pong");
    };
  }, [socket]);

  const sendPing = () => {
    socket.emit("ping");
  };
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/task" element={<Task />} />
        <Route path="/comments/:category/:id" element={<Comments />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
