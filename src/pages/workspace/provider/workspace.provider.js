import React, { useState, useEffect } from "react";
import { useAppService } from "../../../hooks/use-app-service";
import useAuth from "../../../hooks/use-auth";
import toast, { LoaderIcon, Toaster } from "react-hot-toast";
import Validator from "../../../helper/validator";
import { useLocation } from "react-router-dom";
import { faker } from "@faker-js/faker";
import useCollection from "../hook/use-collection.hook";

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
  const teamId = Validator.getLeaf(team, "id");

  const path = useLocation().pathname;
  const pathArray = path.split("/team")[1].split("/");

  // Current team slug
  const teamSlug = pathArray[1];
  const workspaceSlug = pathArray[2];

  const { createCollection, createItem, deleteCollection, updateCollection } =
    useCollection(teamId, workspaceId, {
      onCollectionCreate: (collection) => {
        setAllCollection((prev) => [...prev, collection]);
      },
      onItemCreate: (item) => {},
      onItemUpdate: (item) => {
        setAllCollection((prev) => {
          const oldCollection = prev.find((c) => c.id === item.parent);
          const itemIndex = oldCollection.children.findIndex(
            (c) => c.id === item.id
          );
          oldCollection.children[itemIndex] = item;

          const index = prev.findIndex((c) => c.id === item.parent);
          prev[index] = oldCollection;
          return [...prev];
        });
      },

      onCollectionUpdate: (collection) => {
        setAllCollection((prev) => {
          const index = prev.findIndex((c) => c.id === collection.id);
          prev[index] = collection;
          return [...prev];
        });
      },
      onItemDelete: (id, parent) => {
        setAllCollection((prev) => {
          const oldCollection = prev.find((c) => c.id === parent);
          const newCollection = {
            ...oldCollection,
            children: oldCollection.children.filter((c) => c.id !== id),
          };
          const index = prev.findIndex((c) => c.id === parent);
          prev[index] = newCollection;
          return [...prev];
        });
      },
      onCollectionDelete: (collection) => {
        setAllCollection((prev) => {
          return prev.filter((c) => c.id !== collection.id);
        });
      },
    });

  // Get current teams for current user
  useEffect(() => {
    if (!user || !teamSlug) return;

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

  // Get all collection
  useEffect(() => {
    if (!Validator.hasValue(workspaceId)) {
      return;
    }
    setIsLoadingCollection(true);
    collectionService
      .getAllCollection({ workspaceId: workspace.id, object: "collection" })
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
    createItem,
    deleteCollection,
    updateCollection,
  };

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
};

const data = {
  node1: {
    id: "parentNode1",
    children: ["childNode1"],
  },
  node2: {
    id: "parentNode2",
    children: ["childNode2", "childNode3"],
  },
  node3: {
    id: "childNode1",
    parent: "parentNode1",
  },
  node4: {
    id: "childNode2",
    parent: "parentNode2",
  },
  node5: {
    id: "childNode3",
    parent: "parentNode2",
  },
};

const getTree = (data) => {
  const tree = [];
  const nodes = {};
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const id = node.id;
    const parent = node.parent;
    if (!nodes[id]) {
      nodes[id] = { ...node, children: [] };
    }
    if (parent) {
      if (!nodes[parent]) {
        nodes[parent] = { children: [] };
      }
      nodes[parent].children.push(nodes[id]);
    } else {
      tree.push(nodes[id]);
    }
  }
  return tree;
};
