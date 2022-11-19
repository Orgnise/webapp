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
import OrganizationsPage from "./pages/organization/organizations.page";
import { SocketEvent } from "./constant/socket-event-constant";
import OrganizationPage from "./pages/organization/detail/organization";
import DashBoardPage from "./pages/dashboard/dashboard.page";

function App() {
  const [, , socket] = useSocket();
  // Flag to check and retry socket connection in case of unexpected disconnection from server
  const [auhRetry, setAuthRetry] = useState(0);
  // User data from local storage
  const [user, setUser] = useLocalStorage("user");

  // Disconnect socket on unmount
  useEffect(() => {
    if (!socket || !socket.connected) return;

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket, user]);

  // Retrying user register in socket
  useEffect(() => {
    if (!socket || !socket.connected) {
      return;
    }
    socket.on(
      SocketEvent.auth.register,
      ({ isAuthenticated, event, payload }) => {
        // Check if user is not authenticated
        // If not authenticated, then retry to register user in socket
        if (!isAuthenticated) {
          // If user data is available in local storage, then retry to register user in socket
          if (user && auhRetry === 0) {
            setAuthRetry(1);
            socket.emit(SocketEvent.auth.register, {
              jwtToken: user.jwtToken,
            });
            // Emit event which was not failed from server due to unauthenticated user
            if (event && payload) {
              socket.emit(event, payload);
            }
          } else {
            // If user data is not available in local storage, then redirect to login pages
            setUser({});
            window.location.reload();
          }
        }
      }
    );

    return () => {
      socket.off(SocketEvent.auth.register);
    };
  }, [user]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={AppRoutes.login}
          element={getProtectedRoute(user, <Login />)}
        />
        <Route path={AppRoutes.signup} element={<Signup />} />
        {/* <Route
          path={AppRoutes.organization}
          element={getLoggedInRoute(user, <Task />)}
        /> */}
        <Route
          path={AppRoutes.dashboard}
          element={getLoggedInRoute(user, <DashBoardPage />)}
        >
          <Route path={AppRoutes.organization} element={<OrganizationPage />} />
        </Route>
        <Route
          path={AppRoutes.comments}
          element={getLoggedInRoute(user, <Comments />)}
        />

        <Route
          path={AppRoutes.notFound}
          element={getLoggedInRoute(user, <NoPageFound />)}
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
