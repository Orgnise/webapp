import React, { useState, useEffect } from "react";
import "./style/App.css";
import "./style/comments.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Comments from "./pages/comments.page";
import useLocalStorage from "./hooks/use-local-storage";
import {
  getLoggedInRoute,
  getProtectedRoute,
  Login,
  NoPageFound,
  RouteHelper,
  Task,
} from "./helper/routes.helper";
import { AppRoutes } from "./helper/app-routes";
import useSocket from "./hooks/use-socket.hook";
import Signup from "./pages/auth/signup.page";

/*
👇🏻  Pass Socket.io into the required components
    where communications are made with the server
*/

// export const socket = socketIO(`http://${window.location.hostname}:4000`);

function App() {
  const [, , socket] = useSocket();
  const [storedValue] = useLocalStorage("user");

  useEffect(() => {
    if (!socket || !socket.connected) return;

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={AppRoutes.login}
          element={getProtectedRoute(storedValue, <Login />)}
        />
        <Route path={AppRoutes.signup} element={<Signup />} />
        <Route
          path={AppRoutes.dashboard}
          element={getLoggedInRoute(storedValue, <Task />)}
        />
        <Route
          path={AppRoutes.comments}
          element={getLoggedInRoute(storedValue, <Comments />)}
        />

        <Route
          path={AppRoutes.notFound}
          element={getLoggedInRoute(storedValue, <NoPageFound />)}
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
