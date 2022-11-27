import React from "react";
import { Navigate } from "react-router-dom";
import { lazy } from "react";
import { AppRoutes } from "./app-routes";
import { Login, Signup } from "../pages/auth/index";
const Task = lazy(() => import("../pages/task/task.page"));
const Comments = lazy(() => import("../pages/comments.page"));
const NoPageFound = lazy(() => import("../pages/no-page-found.page"));

function getProtectedRoute(user, element) {
  if (user && Object.keys(user).length !== 0) {
    return <Navigate to={AppRoutes.organization.allOrganizations} />;
  }
  return <Login />;
  // return <Navigate to={AppRoutes.login} />;
}

function getLoggedInRoute(user, element) {
  if (user && Object.keys(user).length !== 0) {
    // return <Navigate to={AppRoutes.dashboard} />;
    return element;
  }
  return <Login />;
}
export { Login, Signup, Task, NoPageFound, Comments };

export { getProtectedRoute, getLoggedInRoute };
