import React, { useState } from "react";
import toast from "react-hot-toast";
import { useAppService } from "../../../../hooks/use-app-service";
import { LoadingSpinner } from "../../../../components/atom/spinner";
import Label from "../../../../components/typography";
import Button from "../../../../components/atom/button";
import Validator from "../../../../helper/validator";
import Nav from "../../../task/component/nav";
import useWorkspace from "../../hook/use-workspace.hook";
import { useNavigate } from "react-router-dom";
import { NavbarLayout } from "../../../layout";

const CreateWorkspacePage = () => {
  const [name, setName] = useState();

  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);

  const { workspaceService } = useAppService();
  const { team } = useWorkspace();
  const navigate = useNavigate();

  const createWorkspace = (e) => {
    const data = {
      name: name,
    };
    setLoading(true);
    workspaceService
      .createWorkspace(team.id, data)
      .then(({ workspace }) => {
        toast.success("Workspace created successfully", {
          position: "top-right",
        });
        navigate(`/team/${team.meta.slug}/${workspace.meta.slug}`);
      })
      .catch((err) => {
        setError(err);
        console.error(err);
        toast.error("Failed to create workspace", { position: "top-right" });
      })
      .then(() => {
        setLoading(false);
      });
  };

  return (
    <div className="flex flex-col h-screen ">
      <NavbarLayout>
        <Nav />
      </NavbarLayout>
      <div className="flex-1 flex flex-col justify-center overflow-hidden bg-default py-6 sm:py-12">
        <div className="relative mx-auto w-full max-w-md bg-card px-6 pt-10   border theme-border sm:rounded-xl sm:px-10">
          <div className="w-full">
            <div className="text-center">
              <Label size="h1" variant="t2">
                Create Workspace
              </Label>
              <p className="mt-2 text-gray-500">
                Use workspace to organize items around topics, projects, or
                more.
              </p>
            </div>
            <div className="mt-8">
              <form onSubmit={createWorkspace}>
                <div className="relative mt-5">
                  <input
                    type="text"
                    name="text"
                    id="text"
                    // value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Workspace name"
                    className="peer w-full rounded-md border theme-border px-3 py-3 bg-card placeholder:text-transparent focus:theme-border focus:outline-none"
                  />
                  <label
                    htmlFor="text"
                    className="pointer-events-none absolute top-0 left-0 ml-3 bg-card origin-left -translate-y-1/2 transform px-1 text-sm  transition-all duration-100 ease-in-out peer-placeholder-shown:top-1/2 peer-placeholder-shown:ml-4 peer-placeholder-shown:text-base peer-placeholder-shown:theme-text-sub2 peer-focus:-top-0 peer-focus:ml-3 peer-focus:text-sm peer-focus:theme-text-h1">
                    Workspace name
                  </label>
                </div>
              </form>
              <div className="flex place-content-end gap-4 my-6 mt-8">
                <Button
                  label="Cancel"
                  type="link"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/team/${team.meta.slug}`);
                  }}
                />
                <Button
                  label="Create"
                  leadingIcon={loading && <LoadingSpinner />}
                  disabled={!Validator.hasValue(name)}
                  onClick={createWorkspace}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateWorkspacePage;
