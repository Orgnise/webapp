import React, { useEffect, useState } from "react";
import cx from "classnames";
import Validator from "../../../helper/validator";
import { LoaderIcon } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAppService } from "../../../hooks/use-app-service";
import useSearchPath from "../../../hooks/use-search-path-hook";
import WorkspaceContentView, {
  LeftPanelSize,
} from "../layout/workspace-content-view";
import FIcon from "../../../components/ficon";
import { solid } from "@fortawesome/fontawesome-svg-core/import.macro";

/**
 * Displays the project view
 */
export default function ProjectView({ displayProject }) {
  const [isLoading, setIsLoading] = useState();
  const [project, setProject] = useState();
  const map = useSearchPath(["workspace", "projects"]);
  const projectSlug = map.projects;
  const orgSlug = map.workspace;
  const { projectService } = useAppService();
  const navigate = useNavigate();

  const [leftPanelSize, setLeftPanelSize] = useState(LeftPanelSize.default);

  // Navigate to first project if no project is selected
  useEffect(() => {
    if (displayProject) {
      navigate(`${orgSlug}/projects/${displayProject.meta.slug}`);
    }
  }, [displayProject]);

  useEffect(() => {
    if (!Validator.hasValue(projectSlug)) {
      return;
    }

    setIsLoading(true);
    projectService
      .getProjectBySlug(projectSlug)
      .then(({ project }) => {
        setProject(project);
      })
      .catch((err) => {
        console.error("getAllProjectsBySlug", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [projectSlug]);

  if (isLoading) {
    return (
      <div className="h-full w-full flex place-content-center items-center">
        <LoaderIcon />
      </div>
    );
  }

  return (
    <>
      <WorkspaceContentView
        content={!project ? <>No Data Available</> : <ProjectContent />}
        leftPanelState={leftPanelSize}
        onLeftPanelStateChange={setLeftPanelSize}
        leftPanel={
          <LeftPanel
            leftPanelSize={leftPanelSize}
            setLeftPanelSize={setLeftPanelSize}
          />
        }
      />
    </>
  );
}

function LeftPanel({ leftPanelSize, setLeftPanelSize }) {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center place-content-end">
        <p className="flex-1 text-lg text-slate-500 mx-1 uppercase">
          Engineering Wiki
        </p>
        <FIcon
          icon={
            leftPanelSize === LeftPanelSize.max
              ? solid("down-left-and-up-right-to-center")
              : solid("up-right-and-down-left-from-center")
          }
          className="hover:bg-gray-200 rounded p-2 m-2 outline-1 outline-gray-500 text-gray-500 cursor-pointer"
          onClick={() => {
            if (leftPanelSize === LeftPanelSize.max) {
              setLeftPanelSize(LeftPanelSize.default);
            } else {
              setLeftPanelSize(LeftPanelSize.max);
            }
          }}
        />
        <FIcon
          icon={solid("angles-left")}
          className={cx(
            "p-2 m-2 outline-1 outline-gray-700 text-gray-500 rounded cursor-pointer",
            "hover:bg-gray-200"
          )}
          onClick={() => {
            setLeftPanelSize(LeftPanelSize.min);
            console.log("min", LeftPanelSize.min);
          }}
        />
      </div>
      <div className="flex flex-col gap-6 h-full overflow-y-auto m-4">
        <div className="font-semibold text-xl">Engineering</div>
        <div className="text-sm text-gray-500">Last updated 2 days ago</div>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <div className="font-semibold">Getting started</div>
            <div className="text-sm text-gray-500">
              Learn how we communicate, collaborate, and get things done at
              Acme.
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold">What's new</div>
            <div className="text-sm text-gray-500">
              Here are our latest updates!
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold">Questions?</div>
            <div className="text-sm text-gray-500">
              Juan is the curator of this workspace. If you have a question or
              notice something that is incorrect or outdated, leave a comment
              and mention @Juan to let him know.
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold">Our tools</div>
            <div className="text-sm text-gray-500">
              Discover the tools we use in our team.
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-4 py-4">
          <div className="flex flex-col gap-2">
            <div className="font-semibold">Getting started</div>
            <div className="text-sm text-gray-500">
              Learn how we communicate, collaborate, and get things done at
              Acme.
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold">What's new</div>
            <div className="text-sm text-gray-500">
              Here are our latest updates!
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold">Questions?</div>
            <div className="text-sm text-gray-500">
              Juan is the curator of this workspace. If you have a question or
              notice something that is incorrect or outdated, leave a comment
              and mention @Juan to let him know.
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <div className="font-semibold">Our tools</div>
            <div className="text-sm text-gray-500">
              Discover the tools we use in our team.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProjectContent() {
  return (
    <div className="flex flex-col gap-8 h-full  py-10">
      <div className="font-semibold text-4xl">Welcome!</div>
      <div className="border-l-4 p-2 border-slate-700">
        <span className="font-semibold">💡 Pulse Tip: </span>This pinned welcome
        page is the first page your team members will see when they join this
        workspace. This is a perfect opportunity to provide some guidance on
        what changed and where to find what.
      </div>
      <div>
        <span className="font-semibold">Welcome to our Engineering Wiki!</span>{" "}
        This is our source of truth for all Engineering-related information,
        such as processes, best practices, setup guides, and more.
      </div>
      <div>
        <div className="font-semibold text-lg">Getting started </div>
        <hr />
        <div className="flex flex-col gap-2">
          <div>
            {" "}
            New to our team? Here are some helpful resources to get you started.
            Our workflows: Learn how we communicate, collaborate, and get things
            done at Acme. Our tools: Discover the tools we use in our team.
          </div>
          <div>...</div>
          <div>...</div>
          <div>...</div>
        </div>
      </div>
      <div>
        <div className="font-semibold text-lg">What's new </div>
        <hr />
        <div className="flex flex-col gap-2">
          <span className="font-semibold">Here are our latest updates!</span>{" "}
          <span>
            {" "}
            If you have anything to share, please add it to the list and mention
            @Engineering to notify the team. A new colleague is joining our
            @Engineering team on 18 Jul 2022. Please everyone say hi to @Rayan!
            👋
          </span>
          <div>...</div>
          <div>...</div>
          <div>...</div>
        </div>
      </div>
      <div>
        <div className="font-semibold text-lg">Questions?</div> <hr />
        <div>
          Juan is the curator of this workspace. If you have a question or
          notice something that is incorrect or outdated, leave a comment and
          mention @Juan to let him know.
        </div>
      </div>
    </div>
  );
}
