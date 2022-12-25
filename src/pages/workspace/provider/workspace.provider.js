import React, { useState, useEffect } from "react";
import { useAppService } from "../../../hooks/use-app-service";
import useAuth from "../../../hooks/use-auth";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import Validator from "../../../helper/validator";
import { useLocation } from "react-router-dom";
import { faker } from "@faker-js/faker";

export const WorkspaceContext = React.createContext();
WorkspaceContext.displayName = "WorkspaceContext";

export const WorkspaceProvider = ({ children }) => {
  const [workspace, setWorkspace] = useState();
  const [isLoadingTeam, setIsLoadingTeam] = useState(false);

  const [allCollection, setAllCollection] = useState();
  const [isLoadingCollection, setIsLoadingCollection] = useState(false);
  const [isCreatingCollection, setIsCreatingCollection] = useState(false);
  const [isDeletingCollection, setIsDeletingCollection] = useState(false);

  const [workspacesList, setWorkspaceList] = useState();
  const [isLoadingWorkSpaceList, setIsLoadingWorkSpaceList] = useState(false);

  const [team, seTeam] = useState();
  const { user } = useAuth();
  const { teamService, workspaceService, collectionService } = useAppService();

  const workspaceId = Validator.getLeaf(workspace, "id");

  const path = useLocation().pathname;
  const pathArray = path.split("/team")[1].split("/");

  // Current team slug
  const teamSlug = pathArray[1];
  const workspaceSlug = pathArray[2];

  // Get current teams for current user
  useEffect(() => {
    if (!user || !teamSlug) return;
    console.log("Getting orgs", teamSlug);
    setIsLoadingTeam(true);
    teamService
      .getOrganizationBySlug(teamSlug)
      .then(({ team }) => {
        seTeam(team);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to load teams");
      })
      .finally(() => {
        setIsLoadingTeam(false);
      });
  }, [teamSlug, user]);

  // Get list of workspaces
  useEffect(() => {
    if (!teamSlug || !user) {
      return;
    }

    setIsLoadingWorkSpaceList(true);
    workspaceService
      .getAllWorkspaceBySlug(teamSlug)
      .then(({ Workspaces }) => {
        if (Workspaces.length != 0) {
          setWorkspaceList(Workspaces);
        }
      })
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        setIsLoadingWorkSpaceList(false);
      });
  }, [teamSlug, user]);

  //  Update selected workspace
  useEffect(() => {
    if (!workspaceSlug || !Validator.hasValue(workspacesList)) {
      return;
    }
    const workspace = workspacesList.find(
      (workspace) => workspace.meta.slug === workspaceSlug
    );

    setWorkspace(workspace);
  }, [workspaceSlug, workspacesList]);

  useEffect(() => {
    if (!Validator.hasValue(workspaceId)) {
      return;
    }
    setIsLoadingCollection(true);
    collectionService
      .getAllCollection({ workspaceId: workspace.id })
      .then(({ items }) => {
        setAllCollection(items);
      })
      .catch((err) => {
        console.error("getAllCollection", err);
      })
      .finally(() => {
        setIsLoadingCollection(false);
      });
  }, [workspaceId]);

  // Create collection
  function createCollection() {
    if (!Validator.hasValue(workspaceId) || isCreatingCollection) {
      return;
    }
    setIsCreatingCollection(true);
    const title = faker.name.jobTitle();
    collectionService
      .createCollection({
        teamId: team.id,
        workspaceId: workspace.id,
        title: title,
        object: "collection",
      })
      .then(({ item }) => {
        setAllCollection((old) => [...old, item]);
      })
      .catch((err) => {
        console.error("getAllCollection", err);
      })
      .finally(() => {
        setIsCreatingCollection(false);
      });
  }

  // Update collection
  function updateCollection(id, title) {
    if (!Validator.hasValue(workspaceId) || isCreatingCollection) {
      return;
    }
    setIsCreatingCollection(true);
    collectionService
      .updateCollection(id, {
        teamId: team.id,
        title,
      })
      .then(({ item }) => {
        setAllCollection((old) =>
          old.map((collection) => {
            if (collection.id === id) {
              return item;
            }
            return collection;
          })
        );
      })
      .catch((err) => {
        console.error("getAllCollection", err);
      })
      .finally(() => {
        setIsCreatingCollection(false);
      });
  }

  // Delete collection
  function deleteCollection(id) {
    if (!Validator.hasValue(workspaceId) || isDeletingCollection) {
      return;
    }
    setIsDeletingCollection(true);

    collectionService
      .deleteCollection(id)
      .then(({ item }) => {
        setAllCollection((old) =>
          old.filter((collection) => collection.id !== id)
        );
        toast.success("Collection deleted", { position: "top-right" });
      })
      .catch((err) => {
        console.error("getAllCollection", err);
        toast.error("Failed to delete collection", { position: "top-right" });
      })
      .finally(() => {
        setIsDeletingCollection(false);
      });
  }

  const value = {
    team,
    isLoadingTeam,
    teamSlug,
    isLoadingTeam,
    workspace,
    workspacesList,
    isLoadingWorkSpaceList,
    allCollection,
    isLoadingCollection,
    createCollection,
    deleteCollection,
    updateCollection,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};
