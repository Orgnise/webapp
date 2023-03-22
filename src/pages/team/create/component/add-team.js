import React, { useState } from "react";
import cx from "classnames";
import { faker } from "@faker-js/faker";
import useSocket from "../../../../hooks/use-socket.hook";
import { useNavigate } from "react-router-dom";
import { history } from "../../../../helper/history.config";
import DropDown from "../../../../components/dropdown";
import { SocketEvent } from "../../../../constant/socket-event-constant";
import Button from "../../../../components/atom/button";
import { TextField } from "../../../../components/molecule/text-field";

const AddTeam = ({ setVisible = () => {} }) => {
  const [name, setName] = useState("");
  const [error, setError] = useState({});
  const createTeam = SocketEvent.team.create;
  const socket = useSocket();

  const handleCreateTeam = (e) => {
    e.preventDefault();

    const payload = {
      name: name,
    };
    // 👇🏻 sends the task to the Socket.io server
    socket.emit(createTeam, payload);
    setName("");
    setVisible(false);
  };

  return (
    <div className="max-w-lg min-w-full flex flex-col">
      <form className="flex flex-col gap-6" onSubmit={handleCreateTeam}>
        <div className="flex flex-col">
          <TextField
            label="Team Name"
            error={error.name}
            placeholder="Enter team name"
            required
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </div>
      </form>
      <Button
        label="Submit"
        disabled={name.length === 0}
        onClick={handleCreateTeam}
      />
    </div>
  );
};

export default AddTeam;
