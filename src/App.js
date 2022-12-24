import React, { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import "./style/App.css";
import "./style/comments.css";
import { Route, Routes } from "react-router-dom";
import { AppRoutes } from "./helper/app-routes";
import useSocket from "./hooks/use-socket.hook";
import Signup from "./pages/auth/signup.page";
import { SocketEvent } from "./constant/socket-event-constant";
import WorkSpacePage from "./pages/workspace";
import ErrorPage from "./pages/error/error-page";
import OnboardingPage from "./pages/onboarding/onboarding";
import useAuth from "./hooks/use-auth";
import { RequireAuth } from "./helper/protected-route";
import { Login } from "./pages/auth";
import NoPageFound from "./pages/no-page-found.page";
import AllTeamsPage from "./pages/team/all-teams.page";
import CreateTeamPage from "./pages/team/create/create-team";
import AddExampleWorkspacePage from "./pages/onboarding/add-example-workspace";

function App() {
  const socket = useSocket([SocketEvent.auth.checkAuth], retryAuth);

  // Flag to check and retry socket connection in case of unexpected disconnection from server
  const [auhRetry, setAuthRetry] = useState(0);
  const auth = useAuth();

  // Retrying user authentication in socket
  function retryAuth(event, payload) {
    const { isAuthenticated } = payload;
    console.log(
      "🚀 ~ file: App.js ~ line 58 ~ useEffect ~ isAuthenticated",
      isAuthenticated
    );
    // Check if user is not authenticated
    console.log("🚀 ~ file: App.js ~ line 64 ~ useEffect ~ auhRetry", auhRetry);
    // If not authenticated, then retry to register user in socket
    if (!isAuthenticated) {
      // If user data is available in local storage, then retry to register user in socket
      if (auth.user && auhRetry === 0) {
        setAuthRetry(1);
        socket.emit(SocketEvent.auth.register, {
          jwtToken: auth.user.jwtToken,
        });
        // Emit event which was not failed from server due to unauthenticated user
        if (event && payload) {
          socket.emit(event, payload);
        }
      } else {
        // If user data is not available in local storage, then redirect to login pages
        toast.error("Session expired, please login again");
        auth.signOut();
        window.location.reload();
      }
    }
  }

  return (
    <>
      <Toaster />

      <Routes>
        <Route path="/" errorElement={<ErrorPage />}>
          <Route path={AppRoutes.login} element={<Login />} />
          <Route path={AppRoutes.signup} element={<Signup />} />
          <Route
            path={AppRoutes.dashboard}
            element={<RequireAuth children={<OnboardingPage />} />}
          />
          <Route
            path={AppRoutes.users.myTeam}
            element={<RequireAuth children={<AllTeamsPage />} />}
          />
          <Route
            path={AppRoutes.team.create}
            element={<RequireAuth children={<CreateTeamPage />} />}
          />
          <Route
            path={AppRoutes.onboard.addExamples}
            element={<RequireAuth children={<AddExampleWorkspacePage />} />}
          />

          <Route
            path={AppRoutes.users.myTeam}
            element={<RequireAuth children={<AllTeamsPage />} />}
          />

          <Route
            path={AppRoutes.workspace.root}
            errorElement={<ErrorPage />}
            element={<RequireAuth children={<WorkSpacePage />} />}
          />
          <Route
            path={AppRoutes.workspace.workspace}
            errorElement={<ErrorPage />}
            element={<RequireAuth children={<WorkSpacePage />} />}
          />

          <Route path={AppRoutes.notFound} element={<NoPageFound />} />
        </Route>
      </Routes>
    </>
  );
}
export default App;
