import React from "react";
import { WorkspaceContext } from "../provider/workspace.provider";

type Workspace = {
  id: string;
  name?: string;
  description?: string;
  team: string;
  members: string[];
  visibility?: "public" | "private" | "archived" | "deleted";
};

/**
 * Hook to get the user from the context
 */
function useWorkspace(): {
  team: object;
  workspace: Partial<Workspace>;
  isLoadingTeam: boolean;
  workspacesList: object;
  isUpdatingWorkspace: boolean;
  handleUpdateWorkspace: (workspace: Workspace) => Promise<void>;
  isLoadingWorkSpaceList: boolean;
  allCollection: Array<object>;
  setAllCollection: React.Dispatch<React.SetStateAction<undefined>>;
  isLoadingCollection: boolean;
  createCollection: Function;
  createItem: (collection: Object) => void;
  /**
   * Update collection/ item
   * @param {Object} data - object containing id, title and content
   * @param {String} data.id - id of collection
   * @param {String} data.title - title of collection
   * @param {String} data.parent - parent id of item (if any)
   * @param {String} data.content - content of collection
   */
  updateCollection: (body: Object) => void;
  deleteCollection: (id: String, parent: String | undefined) => void;
} {
  return React.useContext(WorkspaceContext);
}

export default useWorkspace;
