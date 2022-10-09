import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import cx from "classnames";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function Task({ task, item, index }) {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={cx("mb-2 flex flex-col px-3 py-2 rounded", {
            "bg-orange-100": task[1].title.toLowerCase() === "pending",
            "bg-red-100": task[1].title.toLowerCase() === "ongoing",
            "bg-green-200": task[1].title.toLowerCase() === "completed",
          })}
        >
          <p>{item.title}</p>
          <p className="comment">
            <Link to={`/comments/${task[1].title}/${item.id}`}>
              {item.comments.length > 0 ? `View Comments` : "Add Comment"}
            </Link>
          </p>
        </div>
      )}
    </Draggable>
  );
}
export default Task;
