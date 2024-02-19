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

  const router = useRouter();

  const [status, setStatus] = useState<Status>("idle");

  const handleCreateTeam = async (e: any) => {
    e.preventDefault();
    const name = e.target.name.value;
    const description = e.target.description.value;
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
