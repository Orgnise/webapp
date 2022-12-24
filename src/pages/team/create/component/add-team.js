import React, { useState } from "react";
import cx from "classnames";
import { faker } from "@faker-js/faker";
import useSocket from "../../../../hooks/use-socket.hook";
import { useNavigate } from "react-router-dom";
import { history } from "../../../../helper/history.config";
import DropDown from "../../../../components/dropdown";
import { SocketEvent } from "../../../../constant/socket-event-constant";

const AddTeam = ({ setVisible = () => {} }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState({});
  const createTeam = SocketEvent.team.create;
  const socket = useSocket();

  const handleAddTodo = (e) => {
    e.preventDefault();
    // Use faker.js to generate random data
    const data = {
      name: faker.company.name(),
      description: faker.lorem.paragraph().substring(0, 20),
    };

    //👇🏻 sends the task to the Socket.io server
    socket.emit(createTeam, data);
    setName("");
    setDescription("");
    setVisible(false);
  };

  return (
    <form className="max-w-lg min-w-full" onSubmit={handleAddTodo}>
      <div id="content-4a" className="flex flex-col gap-6">
        <div className="flex flex-col gap-6">
          {/* <!-- Title --> */}
          <div className="relative">
            <input
              id="id-b03"
              type="text"
              name="id-b03"
              placeholder="Task title"
              required={error.name}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={cx(
                "peer relative h-10 w-full rounded border border-slate-200 px-4 text-sm text-slate-500 placeholder-transparent outline-none transition-all autofill:bg-white invalid:border-pink-500  focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400",
                { "invalid:text-pink-500": error.task }
              )}
            />
            <label
              htmlFor="id-b03"
              className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
            >
              Team name
            </label>
            <small className="absolute flex w-full justify-between px-4 py-1 text-xs text-slate-400 invisible peer-invalid:visible transition peer-invalid:text-pink-500">
              <span>Enter team name</span>
            </small>
          </div>

          {/* <!-- Description --> */}
          {/* <div className="relative my-6">
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
              autoComplete="description"
              rows={3}
            />
            <label
              htmlFor="id-b13"
              className="absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
            >
              Description
            </label>
          </div> */}
        </div>

        {/* <!-- Add Task button --> */}
        <button
          disabled={name.length === 0}
          className={cx(
            "inline-flex h-10 w-full items-center justify-center gap-2 whitespace-nowrap rounded bg-emerald-500 px-5 text-sm font-medium tracking-wide text-white transition duration-300 hover:bg-emerald-600 focus:bg-emerald-700 focus-visible:outline-none",
            {
              "disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-gray-300 disabled:text-gray-400 disabled:shadow-none": true,
            }
          )}
        >
          <span>Create Team</span>
        </button>
      </div>
    </form>
  );
};

export default AddTeam;
