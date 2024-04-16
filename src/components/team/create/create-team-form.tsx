"use client";
import { Spinner } from "@/components/atom/spinner";
import { TextField } from "@/components/molecule/text-field";
import { Button } from "@/components/ui/button";
import useTeams from "@/lib/swr/use-teams";
import { Team } from "@/lib/types/types";
import { useState } from "react";

type Status = "idle" | "loading" | "error" | "success";

const AddTeam = () => {
  const { createTeamAsync } = useTeams();

  const [status, setStatus] = useState<Status>("idle");

  const handleCreateTeam = async (e: any) => {
    e.preventDefault();
    const name = e.target.name.value;
    const description = e.target.description.value;
    setStatus("loading");

    const payload = {
      name: name,
      description: description,
    } as Team;
    createTeamAsync(payload).finally(() => {
      setStatus("success");
    });
  };

  return (
    <form
      onSubmit={handleCreateTeam}
      className="flex min-w-full max-w-lg flex-col"
    >
      <div className="flex flex-col">
        <TextField
          min={3}
          max={30}
          name="name"
          label="Team Name"
          placeholder="Enter team name"
          required={true}
        />
        <TextField
          min={3}
          max={120}
          name="description"
          label="Team Description"
          placeholder="Enter team description"
          required={true}
        />
      </div>

      <Button type="submit">
        {status === "loading" ? <Spinner /> : "Create"}
      </Button>
    </form>
  );
};

export default AddTeam;
