import React from "react";
import { Navigate } from "react-router-dom";
import { lazy } from "react";
import { AppRoutes } from "./app-routes";
const Login = lazy(() => import("../pages/login.page"));
const Task = lazy(() => import("../pages/task/task.page"));
const Comments = lazy(() => import("../pages/comments.page"));
const NoPageFound = lazy(() => import("../pages/no-page-found.page"));

function getProtectedRoute(user, element) {
  if (user && Object.keys(user).length !== 0) {
    console.log("getProtectedRoute", user);
    return <Navigate to={AppRoutes.dashboard} />;
  }
  return <Login />;
  // return <Navigate to={AppRoutes.login} />;
}

function getLoggedInRoute(user, element) {
  if (user && Object.keys(user).length !== 0) {
    console.log("getLoggedInRoute", user);
    // return <Navigate to={AppRoutes.dashboard} />;
    return element;
  }
  return <Login />;
}
export { Login, Task, NoPageFound, Comments };

export { getProtectedRoute, getLoggedInRoute };
