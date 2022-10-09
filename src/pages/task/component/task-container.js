import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import cx from "classnames";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useSocket from "../../../hooks/use-socket.hook";
import Task from "./task";

const TasksContainer = () => {
  const [socketState, setSocketData, socket] = useSocket(["tasks"], {});
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    function fetchTasks() {
      fetch("http://localhost:4000/task")
        .then((res) => res.json())
        .then((data) => {
          setSocketData({
            tasks: data.response,
          });
          setTasks(data.response);
        });
    }
    fetchTasks();
  }, []);

  useEffect(() => {
    if (socketState.tasks) {
      console.log("Tasks updated");
      setTasks(socketState.tasks);
    }
  }, [socketState.tasks]);

  //👇🏻 This function is the value of the onDragEnd prop
  const handleDragEnd = ({ destination, source }) => {
    if (!destination) return;
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    )
      return;

    socket.emit("taskDragged", {
      source,
      destination,
    });

    console.log("🚀: handleDragEnd -> source", source);
    console.log("🚀: handleDragEnd -> destination", destination);
  };

  if (!tasks || !Object.entries(tasks)) {
    return <div>Loading...</div>;
  }
  // console.log("🚀: TasksContainer -> tasks", Object.entries(tasks));
  return (
    <section className="w-full">
      <div className="max-w-screen-lg m-auto">
        <div className="flex flex-col sm:flex-row">
          <DragDropContext onDragEnd={handleDragEnd}>
            {Object.entries(tasks).map((task) => (
              <div
                className={`w-full sm:w-1/3 select-none`}
                key={task[1].title}
              >
                <h3 className="font-bold text-lg first-letter:uppercase m-2">
                  {task[1].title} Tasks
                </h3>
                <div className="border p-2 h-full m-2">
                  {/** --- 👇🏻 Droppable --- */}
                  <Droppable droppableId={task[1].title}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {task[1].items.map((item, index) => (
                          <Task
                            key={item.id}
                            task={task}
                            item={item}
                            index={index}
                          />
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}
          </DragDropContext>
        </div>
      </div>
    </section>
  );
};

export default TasksContainer;
