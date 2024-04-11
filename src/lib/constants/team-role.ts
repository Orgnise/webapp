export const roles = ["owner", "moderator", "guest", "member"] as const;

export type TeamRole = (typeof roles)[number];

export const TeamPermissions = [
  "INVITE_MANAGE_REMOVE_TEAM_MEMBER",
  "RENAME_TEAM",
  "DELETE_TEAM_INFO",
  "UPDATE_TEAM_INFO",
  "UPGRADE_TEAM_PLAN",
  "CAN_BE_ADDED_TO_WORKSPACE",
  "JOIN_PUBLIC_WORKSPACE",
  "CREATE_WORKSPACE",
  "UPDATE_WORKSPACE",
  "DELETE_WORKSPACE",
  "DELETE_TEAM",
] as const;

export type TeamPermission = (typeof TeamPermissions)[number];

type PermissionObject = { [key in TeamPermission]: boolean };

export type TeamRolePermission = {
  [key in TeamRole]: PermissionObject;
};

export const teamRolePermissions: TeamRolePermission = {
  owner: {
    INVITE_MANAGE_REMOVE_TEAM_MEMBER: true,
    RENAME_TEAM: true,
    DELETE_TEAM_INFO: true,
    UPDATE_TEAM_INFO: true,
    UPGRADE_TEAM_PLAN: true,
    CAN_BE_ADDED_TO_WORKSPACE: true,
    JOIN_PUBLIC_WORKSPACE: true,
    CREATE_WORKSPACE: true,
    UPDATE_WORKSPACE: true,
    DELETE_WORKSPACE: true,
    DELETE_TEAM: true,
  },
  moderator: {
    INVITE_MANAGE_REMOVE_TEAM_MEMBER: true,
    RENAME_TEAM: false,
    DELETE_TEAM_INFO: false,
    UPDATE_TEAM_INFO: false,
    UPGRADE_TEAM_PLAN: false,
    CAN_BE_ADDED_TO_WORKSPACE: true,
    JOIN_PUBLIC_WORKSPACE: true,
    CREATE_WORKSPACE: true,
    UPDATE_WORKSPACE: true,
    DELETE_WORKSPACE: true,
    DELETE_TEAM: false,
  },
  guest: {
    INVITE_MANAGE_REMOVE_TEAM_MEMBER: false,
    RENAME_TEAM: false,
    DELETE_TEAM_INFO: false,
    UPDATE_TEAM_INFO: false,
    UPGRADE_TEAM_PLAN: false,
    CAN_BE_ADDED_TO_WORKSPACE: false,
    JOIN_PUBLIC_WORKSPACE: true,
    CREATE_WORKSPACE: false,
    UPDATE_WORKSPACE: false,
    DELETE_WORKSPACE: false,
    DELETE_TEAM: false,
  },
  member: {
    INVITE_MANAGE_REMOVE_TEAM_MEMBER: false,
    RENAME_TEAM: false,
    DELETE_TEAM_INFO: false,
    UPDATE_TEAM_INFO: false,
    UPGRADE_TEAM_PLAN: false,
    CAN_BE_ADDED_TO_WORKSPACE: false,
    JOIN_PUBLIC_WORKSPACE: true,
    CREATE_WORKSPACE: false,
    UPDATE_WORKSPACE: false,
    DELETE_WORKSPACE: false,
    DELETE_TEAM: false,
  },
} as const;

export function checkPermissions(
  role: TeamRole,
  permission: TeamPermission,
): boolean {
  return teamRolePermissions[role][permission];
}
