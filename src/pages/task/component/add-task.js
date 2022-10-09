import React, { useState } from "react";
import cx from "classnames";
import useSocket from "../../../hooks/use-socket.hook";
import { useNavigate } from "react-router-dom";
import { history } from "../../../helper/history.config";
import DropDown from "../../../components/dropdown";

const AddTask = ({ setVisible = () => {} }) => {
  const [task, setTask] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("low");
  const [status, setStatus] = useState();
  const [error, setError] = useState({});
  const [state, setState, socket] = useSocket(["createTask"], {});

  React.useEffect(() => {
    if (state.createTask) {
      console.log("Task added", state.createTask);
    }
  }, [state.createTask]);

  const handleAddTodo = (e) => {
    e.preventDefault();
    if (task.length === 0) {
      setError({ task: "Task is required" });
      return;
    }
    //👇🏻 sends the task to the Socket.io server
    socket.emit("createTask", { task, description });
    setTask("");
    setDescription("");
    setVisible(false);
  };

  const statusType = [
    {
      label: "Todo",
      disabled: false,
      value: "Todo",
    },
    {
      label: "In Progress",
      disabled: false,
      value: "Inprogress",
    },
    {
      label: "Done",
      disabled: false,
      value: "Done",
    },
    {
      label: "In Review",
      disabled: false,
      value: "InReview",
    },
  ];

  return (
    <form className="max-w-lg min-w-full" onSubmit={handleAddTodo}>
      <div id="content-4a" className="flex-1">
        <div className="flex flex-col gap-6">
          <DropDown
            options={statusType}
            className="w-1/2"
            value={status}
            onChange={(value) => {
              setStatus(value);
              console.table(value);
            }}
          />

          {/* <!-- Title --> */}
          <div className="relative">
            <input
              id="id-b03"
              type="text"
              name="id-b03"
              placeholder="Task title"
              required={error.task}
              value={task}
              onChange={(e) => setTask(e.target.value)}
              className={cx(
                "peer relative h-10 w-full rounded border border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500  focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
                { "invalid:text-pink-500": error.task }
              )}
            />
            <label
              htmlFor="id-b03"
              className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
            >
              Task title
            </label>
            <small className="absolute flex w-full justify-between px-4 py-1 text-xs text-slate-400 invisible peer-invalid:visible transition peer-invalid:text-pink-500">
              <span>Enter task title</span>
            </small>
          </div>

          {/* <!-- Description --> */}
          <div className="relative my-6">
            <textarea
              className="peer relative  w-full rounded border border-slate-200 px-4 pr-12 py-2 max-h-96 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
              placeholder="Task description"
              onChange={(e) => {
                setDescription(e.target.value);
                e.target.style.height = "inherit";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              id="id-b13"
              name="id-b13"
              rows={3}
            />
            <label
              htmlFor="id-b13"
              className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
            >
              Description
            </label>

            {/* <small className="absolute flex w-full justify-between px-4 py-1 text-xs text-slate-400 transition peer-invalid:text-pink-500">
              <span>Type your password</span>
            </small> */}
          </div>
        </div>

        {/* <!-- Add Task button --> */}
        <button className="inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded bg-emerald-500 px-5 text-sm font-medium tracking-wide text-white transition duration-300 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none">
          <span>Add Task</span>
        </button>
      </div>
    </form>
  );
};

export default AddTask;
