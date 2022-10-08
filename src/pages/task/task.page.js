import React, { useState } from "react";
import TasksContainer from "./component/task-container";
import Nav from "./component/nav";

const Task = () => {
  return (
    <div className="flex flex-col space-y-12">
      <Nav />
      <TasksContainer />
    </div>
  );
};

export default Task;
