export const workspaceRole = ["editor", "reader"] as const;

export type WorkspaceRole = (typeof workspaceRole)[number];

export const WorkspacePermissions = [
  "VIEW_CONTENT",
  "CREATE_CONTENT",
  "EDIT_CONTENT",
  "DELETE_CONTENT",
  "UPDATE_WORKSPACE_INFO",
  "UPDATE_WORKSPACE_VISIBILITY",
  "INVITE_MANAGE_REMOVE_WORKSPACE_MEMBER"
] as const;

export type WorkspacePermission = (typeof WorkspacePermissions)[number];

type PermissionObject = { [key in WorkspacePermission]: boolean };

export type WorkspaceRolePermission = {
  [key in WorkspaceRole]: PermissionObject;
};

export const workspaceRolePermissions: WorkspaceRolePermission = {
  editor: {
    VIEW_CONTENT: true,
    CREATE_CONTENT: true,
    EDIT_CONTENT: true,
    DELETE_CONTENT: true,
    UPDATE_WORKSPACE_INFO: true,
    UPDATE_WORKSPACE_VISIBILITY: true,
    INVITE_MANAGE_REMOVE_WORKSPACE_MEMBER: true,
  },
  reader: {
    VIEW_CONTENT: true,
    CREATE_CONTENT: false,
    EDIT_CONTENT: false,
    DELETE_CONTENT: false,
    UPDATE_WORKSPACE_INFO: false,
    UPDATE_WORKSPACE_VISIBILITY: false,
    INVITE_MANAGE_REMOVE_WORKSPACE_MEMBER: false,
  },
} as const;

export function checkWorkspacePermissions(
  role: WorkspaceRole | undefined,
  permission: WorkspacePermission,
): boolean {
  if (!role) return false;
  return workspaceRolePermissions[role][permission];
}

