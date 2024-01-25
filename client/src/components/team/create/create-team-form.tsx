"use client";
import { Spinner } from "@/components/atom/spinner";
import { TextField } from "@/components/molecule/text-field";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Status = "idle" | "loading" | "error" | "success";

const AddTeam = () => {
  const { toast } = useToast();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<{
    name?: string;
    description?: string;
  }>({});

  const router = useRouter();

  const [status, setStatus] = useState<Status>("idle");
  // const createTeam = SocketEvent.team.create;
  // const socket = useSocket();

  const handleCreateTeam = async (e: any) => {
    e.preventDefault();

    setStatus("loading");

    const payload = {
      name: name,
      description: description,
    };
    const res = await fetch("/api/teams/create", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (res.status === 200) {
      setStatus("success");
      toast({
        title: "Team created",
        description: "Team has been created",
        variant: "default",
      });
      setTimeout(() => {
        router.push(`./${data?.team?.meta?.slug}/add-example`);
      }, 1000);
    } else {
      setStatus("error");
      let err = data?.error ?? "something went wrong";
      toast({
        title: "Error",
        description: err,
        variant: "destructive",
      });
    }
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
          <TextField
            label="Team Description"
            error={error.name}
            placeholder="Enter team description"
            required
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          />
        </div>
      </form>
      <Button disabled={name.length === 0} onClick={handleCreateTeam}>
        {status === "loading" ? <Spinner /> : "Create"}
      </Button>
    </div>
  );
};

export default AddTeam;
