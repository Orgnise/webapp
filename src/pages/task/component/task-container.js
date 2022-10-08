import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import cx from "classnames";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import useSocket from "../../../hooks/use-socket.hook";

const TasksContainer = () => {
  const [socketState, setSocketData, socket] = useSocket(["tasks"], {});

  useEffect(() => {
    function fetchTasks() {
      fetch("http://localhost:4000/api")
        .then((res) => res.json())
        .then((data) => {
          setSocketData((prevState) => ({ ...prevState, tasks: data }));
        });
    }
    fetchTasks();
  }, []);

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

  if (!socketState.tasks || !Object.entries(socketState.tasks)) {
    return <div>Loading...</div>;
  }
  // console.log("🚀: TasksContainer -> tasks", Object.entries(tasks));
  return (
    <section className="w-full">
      <div className="max-w-screen-lg m-auto">
        <div className="flex flex-col sm:flex-row">
          <DragDropContext onDragEnd={handleDragEnd}>
            {Object.entries(socketState.tasks).map((task) => (
              <div className={"w-full sm:w-1/3"} key={task[1].title}>
                <h3 className="font-bold text-lg first-letter:uppercase m-2">
                  {task[1].title} Tasks
                </h3>
                <div className="border p-2 h-full m-2">
                  {/** --- 👇🏻 Droppable --- */}
                  <Droppable droppableId={task[1].title}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.droppableProps}>
                        {task[1].items.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                // className={`${task[1].title.toLowerCase()}__items`}
                                className={cx(
                                  "mb-2 flex flex-col px-3 py-2 rounded items-end",
                                  {
                                    "bg-red-100":
                                      task[1].title.toLowerCase() === "ongoing",
                                    "bg-yellow-100":
                                      task[1].title.toLowerCase() === "pending",
                                    "bg-green-200":
                                      task[1].title.toLowerCase() ===
                                      "completed",
                                  }
                                )}
                              >
                                <p className="w-full">{item.title}</p>
                                <p className="text-xs text-blue-500">
                                  <Link
                                    to={`/comments/${task[1].title}/${item.id}`}
                                  >
                                    {item.comments.length > 0
                                      ? `View Comments`
                                      : "Add Comment"}
                                  </Link>
                                </p>
                              </div>
                            )}
                          </Draggable>
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
