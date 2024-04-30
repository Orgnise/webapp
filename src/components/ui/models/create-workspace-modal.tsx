import { TeamContext } from "@/app/(dashboard)/[team_slug]/providers";
import { TextField } from "@/components/molecule/text-field";
import { HelpCircleIcon, XIcon } from "lucide-react";
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { Button, Button2 } from "../button";
import { Modal } from "../model";
import { Switch } from "../switch";

import { Logo } from "@/components/atom/logo";
import { fromZodError } from "@/lib/api/errors";
import { Visibility } from "@/lib/schema/workspace.schema";
import useTeam from "@/lib/swr/use-team";
import { createWorkspaceSchema } from "@/lib/zod/schemas/workspaces";
import Image from "next/image";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../select";
import { ToolTipWrapper } from "../tooltip";

export function CreateWorkspaceModel({
  showModal,
  setShowModal,
}: {
  showModal: boolean;
  setShowModal: Dispatch<SetStateAction<boolean>>;
}) {
  const [status, setStatus] = useState<"idle" | "loading">("idle");
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

  const { createWorkspace } = useContext(TeamContext);
  const { team } = useTeam();

  function CreateWorkspaceModal(e: any) {
    e.preventDefault();

    const formData = createWorkspaceSchema.safeParse({
      name: e.target.name.value,
      description: e.target.description.value,
      visibility: (isPrivate ? "private" : "public") as Visibility,
      defaultAccess: e.target.defaultAccess.value,
    });
    if (!formData.success) {
      console.error(fromZodError(formData.error));
      return;
    }
    if (status === "loading") {
      return;
    }
    setStatus("loading");

    // @ts-ignore
    createWorkspace(formData.data)
      .then(() => {
        setShowModal(false);
      })
      .finally(() => {
        setStatus("idle");
      });
    console.log(formData);
  }

  return (
    <Modal showModal={showModal} setShowModal={setShowModal}>
      <div className="relative border-border bg-card">
        <Button
          variant={"ghost"}
          size={"icon"}
          className="absolute right-2 top-1 rounded-full"
          onClick={() => setShowModal(false)}
        >
          <XIcon className="text-muted-foreground" size={16} />
        </Button>
        <div className="flex flex-col items-center justify-center space-y-3 border-b border-border px-4 py-4 pt-8 sm:px-16">
          {team.logo ? (
            <Image
              src={team.logo}
              unoptimized
              alt={"Logo"}
              className="h-16 w-16 rounded-full"
              height={64}
              width={64}
            />
          ) : (
            <Logo className="h-10" />
          )}
          <h3 className="text-lg font-medium">Create workspace</h3>
          <p className="text-center text-sm text-muted-foreground">
            Create a new workspace to start managing your collections.
          </p>
        </div>
        <form
          onSubmit={CreateWorkspaceModal}
          className="flex flex-col bg-accent/30 p-6 pt-3"
        >
          <TextField
            maxLength={30}
            minLength={3}
            name="name"
            label="Name"
            required
            placeholder="Engineering wiki"
            hint={
              <p className="max-w-sm text-center ">
                This is the name of workspace
              </p>
            }
          />

          <TextField
            maxLength={120}
            name="description"
            label="Description"
            placeholder="Engineering wiki for the team"
            hint={
              <p className="max-w-sm text-center ">
                This is the description of workspace
              </p>
            }
          />
          <div className="mb-2 flex place-content-between  p-2">
            <span className="text-sm">
              <span className="flex items-center gap-2 text-base font-medium">
                Private
                <ToolTipWrapper
                  content={
                    <p className="max-w-sm text-center ">
                      Decide whether to create a public or private workspace.
                      Only those invited may access a private workspace.
                    </p>
                  }
                >
                  <HelpCircleIcon className="text-muted-foreground" size={16} />
                </ToolTipWrapper>
              </span>
            </span>
            <Switch
              id="visibility"
              name="visibility"
              onCheckedChange={setIsPrivate}
              checked={isPrivate}
            />
          </div>
          <div className="mb-5 flex flex-row place-content-between px-2 py-1.5">
            <span className="flex items-center gap-1 text-base font-medium">
              Default Access
              <ToolTipWrapper
                content={
                  <p className="max-w-sm text-center ">
                    Select whether the workspace members should have full
                    access, or read-only permissions as the default.
                  </p>
                }
              >
                <HelpCircleIcon className="text-muted-foreground" size={16} />
              </ToolTipWrapper>
            </span>
            <Select defaultValue="full" name="defaultAccess">
              <SelectTrigger className="w-[140px] gap-1  px-2 ">
                <SelectValue placeholder={"Full Access"} />
              </SelectTrigger>
              <SelectContent className="border-border">
                <SelectItem value={"full"}>Full access</SelectItem>
                <SelectItem value="read-only">Read only</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end">
            <Button2
              text="Create"
              type="submit"
              loading={status === "loading"}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}

export function WorkspacePlaceholder() {
  return (
    <div className="mx-auto grid max-w-screen-xl grid-cols-1 gap-5 px-2.5 py-10 sm:grid-cols-2 lg:grid-cols-3 lg:px-20">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="flex h-[146px] w-full cursor-pointer flex-col place-content-between items-start rounded border border-border bg-card p-6   hover:text-accent-foreground hover:shadow"
        >
          <div className="flex w-full items-center gap-2">
            <div className="h-14 w-14 min-w-[56px] rounded-full bg-secondary "></div>
            <div className="flex w-full flex-col gap-1">
              <div className="h-6 w-4/12 rounded bg-secondary"></div>
              <div className="h-3 w-6/12 rounded bg-secondary"></div>
            </div>
          </div>
          <div className="ml-[56px] h-6 w-9/12 rounded bg-secondary"></div>
        </div>
      ))}
    </div>
  );
}

export function useCreateWorkspaceModal() {
  const [showModal, setShowModal] = useState(false);

  const createWorkspaceModalCallback = useCallback(() => {
    return (
      <CreateWorkspaceModel showModal={showModal} setShowModal={setShowModal} />
    );
  }, [showModal, setShowModal]);

  return useMemo(
    () => ({
      setShowModal,
      DeleteAccountModal: createWorkspaceModalCallback,
    }),
    [setShowModal, createWorkspaceModalCallback],
  );
}
