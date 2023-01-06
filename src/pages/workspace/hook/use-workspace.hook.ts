import React from "react";
import { WorkspaceContext } from "../provider/workspace.provider";

/**
 * Hook to get the user from the context
 */
function useWorkspace(): {
  team: object;
  workspace: object;
  isLoadingTeam: boolean;
  workspacesList: object;
  isLoadingWorkSpaceList: boolean;
  allCollection: Array<object>;
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
