import React, { useState } from "react";
import TasksContainer from "./component/task-container";
import Nav from "./component/nav";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {
  Comments,
  getLoggedInRoute,
  getProtectedRoute,
  NoPageFound,
} from "../../helper/routes.helper";
import { AppRoutes } from "../../helper/app-routes";
import useLocalStorage from "../../hooks/use-local-storage";

const Task = () => {
  const [storedValue, setValue] = useLocalStorage("user");
  return (
    <div className="flex flex-col h-screen">
      <Nav />
      <TasksContainer />
    </div>
  );
};

export default Task;
