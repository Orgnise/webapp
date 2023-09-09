import React, { useState } from "react";
import cx from "classnames";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "../../../../components/breadcrumb";
import Label from "../../../../components/typography";
import { NavbarLayout } from "../../../layout";
import Nav from "../../../task/component/nav";
import { TextField } from "../../../../components/molecule/text-field";
import useWorkspace from "../../hook/use-workspace.hook";
import Validator from "../../../../helper/validator";
import Button from "../../../../components/atom/button";
import { useAppService } from "../../../../hooks/use-app-service";
import { LoadingSpinner } from "../../../../components/atom/spinner";

function WorkspaceSettingsPage() {
  const [workspaceName, setWorkspaceName] = useState();

  const {
    workspace,
    handleUpdateWorkspace,
    isUpdatingWorkspace,
    deleteWorkspace,
  } = useWorkspace();
  const {} = useAppService();
  const param = useLocation().pathname.split("/");
  const navigation = useNavigate();

  React.useEffect(() => {
    if (Validator.hasValue(workspace)) {
      setWorkspaceName(workspace.name);
    }
  }, [workspace]);

  if (!Validator.hasValue(workspace)) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen ">
      <NavbarLayout>
        <Nav />
      </NavbarLayout>
      <div className="flex-1 flex flex-col mx-auto w-full max-w-2xl py-4">
        <Breadcrumb
          items={[
            {
              label: "All Team",
              link: `/${param[1]}`,
            },
            {
              label: "Workspace",
              link: `/${param[1]}/${param[2]}/${param[3]}`,
            },
            {
              label: "Settings",
              link: `#`,
            },
          ]}
          className="mb-4"
        />

        <div className="flex gap-2 mt-8 items-end">
          <Label size="h2" variant="t1">
            Workspace Settings
          </Label>
          <Label
            variant="s2"
            className="bg-surface px-2 rounded-full first-letter:uppercase border theme-border">
            {workspace.visibility}
          </Label>
        </div>
        <hr className="my-4 theme-border" />
        <div className="mt-4 flex flex-col gap-2 ">
          <div className="flex w-full items-center">
            <TextField
              label="Workspace Name"
              wrapperClassName="flex-1"
              onChange={(e) => {
                setWorkspaceName(e.target.value);
              }}
              autoComplete="text"
              type="text"
              value={workspaceName}
            />
            <Button
              className="ml-2"
              label="Rename"
              leadingIcon={isUpdatingWorkspace && <LoadingSpinner />}
              disabled={isUpdatingWorkspace}
              onClick={(e) => {
                if (Validator.hasValue(workspaceName)) {
                  handleUpdateWorkspace({
                    ...workspace,
                    name: workspaceName,
                  });
                }
              }}
            />
          </div>
        </div>

        {/* Integration */}
        <Label size="h2" variant="t1">
          Integration
        </Label>
        <hr className="my-4 theme-border" />
        <div className="mt-4 flex flex-col gap-4">
          <TileComponent
            title="Slack"
            subtext="Connect your workspace with Slack"
            buttonText="Connect"
            disabled
          />
        </div>

        {/* Danger Zone */}
        <Label size="h2" variant="t1" className="mt-8">
          Danger Zone
        </Label>
        <hr className="my-4 theme-border" />
        <div className="mt-4 flex flex-col gap-4 ">
          <TileComponent
            title="Change workspace visibility"
            buttonText={
              workspace.visibility === "public"
                ? "Change To Public"
                : "Change To Private"
            }
            subtext="This will change the visibility of all the collections in this workspace"
            onClick={() => {
              handleUpdateWorkspace({
                ...workspace,
                visibility:
                  workspace.visibility === "public" ? "private" : "public",
              });
            }}
          />
          <TileComponent
            title="Archive this workspace"
            buttonText="Archive"
            disabled={true}
            subtext={`Mark this workspace as archived and read-only. You can always unarchive this workspace later.`}
            onClick={() => {
              handleUpdateWorkspace({
                ...workspace,
                visibility: "archived",
              });
            }}
          />

          <TileComponent
            title="Delete this workspace"
            buttonText="Delete"
            subtext="This will delete all the collections in this workspace. Once you delete a workspace, there is no going back. Please be certain."
            onClick={async () => {
              const isDeleted = await deleteWorkspace(workspace.meta.slug);
              if (isDeleted) {
                navigation(-1);
              }
            }}
          />
        </div>
      </div>
    </div>
  );

  function TileComponent({
    title,
    subtext,
    buttonText,
    onClick = () => {},
    disabled = false,
    trailing,
  }) {
    return (
      <div
        className={cx("flex gap-2 w-full items-end place-content-end", {
          "opacity-40 grayscale": disabled,
        })}>
        <div className="flex-1 flex-col w-7/12">
          <Label>{title}</Label>
          {subtext && (
            <Label variant="s1" size="body" className="block">
              {subtext}
            </Label>
          )}
        </div>
        <div className="w-3/12 flex place-content-end">
          {trailing && trailing}
          {buttonText && (
            <div>
              <Button
                label={buttonText}
                type="link"
                className="w-full"
                onClick={onClick}
                disabled={isUpdatingWorkspace || disabled}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
}
export default WorkspaceSettingsPage;
