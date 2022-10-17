import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import cx from "classnames";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useSocket from "../../../hooks/use-socket.hook";
import Task from "./task";
import useLocalStorage from "../../../hooks/use-local-storage";

const TasksContainer = () => {
  const [socketState, setSocketData, socket] = useSocket(["tasks"], {});
  const [tasks, setTasks] = useState([]);
  const [errors, setErrors] = useState({});
  const [dragFirstTask, setDragFirstTask] = useState(false);
  const [user, setUser] = useLocalStorage("user");

  useEffect(() => {
    function fetchTasks() {
      fetch("http://localhost:4000/task", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": user.token,
        },
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setErrors({ tasks: data.error });
            console.log("error", data.error);
          } else {
            setSocketData({
              tasks: data.response,
            });
            setTasks(data.response);
            setErrors({ tasks: undefined });
          }
        })
        .catch((err) => {
          console.log(err);
          setSocketData({ tasks: [] });
          setErrors({ tasks: "No tasks found" });
        });
    }
    if (user) {
      fetchTasks();
    } else {
      setTasks([]);
      setErrors({ tasks: "Sign in to view tasks" });
    }
  }, [user]);

  useEffect(() => {
    if (socketState.tasks) {
      console.log("Tasks updated", socketState.tasks);
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

  // 👇🏻 This is function to handle drag update
  const handleDragUpdate = (update) => {
    const { destination } = update;
    if (destination && destination.droppableId !== null) {
      setDragFirstTask(destination.droppableId);
      console.log("🚀: TasksContainer -> update", destination.droppableId);
    }
  };

  if (!tasks || !Object.entries(tasks)) {
    return <div>Loading...</div>;
  }
  return (
    <section className="w-full pt-12 flex-grow">
      <div
        className="max-w-screen-xl m-auto  flex flex-col sm:flex-row space-x-2 items-start "
        style={{ maxHeight: "calc(100vh - 124px)", marginBottom: "20px" }}
      >
        <DragDropContext
          onDragEnd={handleDragEnd}
          onDragUpdate={(e) => {
            handleDragUpdate(e);
          }}
        >
          {Object.entries(tasks).map((task) => (
            <div
              className={`w-full  select-none bg-slate-100 rounded h-full sm:overflow-y-auto`}
              key={task[1].title}
              style={{
                maxHeight: "calc(100vh - 124px)",
                marginBottom: "20px",
              }}
            >
              <h3 className="font-bold text-lg first-letter:uppercase p-5 sticky top-0 bg-slate-100 rounded">
                {task[1].title}
              </h3>
              {/** --- 👇🏻 Droppable --- */}
              <Droppable droppableId={task[1].title}>
                {(provided) => {
                  return (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className="px-2"
                    >
                      {task[1].items.map((item, index) => (
                        <Task
                          key={item.id}
                          task={task}
                          item={item}
                          index={index}
                        />
                      ))}
                      {task[1].items.length === 0 && (
                        <div
                          className={cx(
                            "text-center text-slate-700 p-5 border mb-2 rounded bg-gray-200 shadow-inner transition-all duration-500",
                            {
                              "opacity-0 bg-gray-50 text-slate-100 scale-75":
                                dragFirstTask === task[1].title,
                            }
                          )}
                        >
                          No task available here
                        </div>
                      )}
                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
            </div>
          ))}
        </DragDropContext>
        {errors && errors.tasks && (
          <h3 className=" w-full text-center font-bold text-lg p-5 text-red-400">
            {errors.tasks}
          </h3>
        )}
      </div>
      {/* </div> */}
    </section>
  );
};

export default TasksContainer;
