import React, { useState } from "react";
import AddTask from "../components/add-task";
import TasksContainer from "../components/task-container";
import Nav from "../components/nav";
import { socket } from "../App";

const Task = () => {
  const sendPing = () => {
    socket.emit("ping");
  };
  return (
    <div>
      <Nav />
      <AddTask socket={socket} />
      <TasksContainer socket={socket} />
    </div>
  );
};

export default Task;
