import React, { useState } from "react";
import cx from "classnames";
import { faker } from "@faker-js/faker";
import useSocket from "../../../../hooks/use-socket.hook";
import { useNavigate } from "react-router-dom";
import { history } from "../../../../helper/history.config";
import DropDown from "../../../../components/dropdown";
import { SocketEvent } from "../../../../constant/socket-event-constant";
import Button from "../../../../components/atom/button";

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

    // 👇🏻 sends the task to the Socket.io server
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
              className={cx("peer relative  theme-input w-full", {
                "invalid:text-pink-500": error.task,
              })}
            />
            <label
              htmlFor="id-b03"
              className="absolute left-2 -top-2 z-[1] px-2 text-xs theme-text-sub1 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-surface before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent">
              Team name
            </label>
            <small className="absolute flex w-full justify-between px-4 py-1 text-xs  invisible peer-invalid:visible transition peer-invalid:text-pink-500">
              <span>Enter team name</span>
            </small>
          </div>
        </div>

        <Button label="Submit" disabled={name.length === 0} />
      </div>
    </form>
  );
};

export default AddTeam;
