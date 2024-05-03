import {
  WorkspacePermission,
  checkWorkspacePermissions,
} from "@/lib/constants/workspace-role";
import useWorkspaces from "@/lib/swr/use-workspaces";
import { Fold } from "@/lib/utils";
import cx from "classnames";
import React from "react";

export interface Props {
  className?: string;
  additionalCheck?: boolean;
  permission: WorkspacePermission;
  unAuthorized?: React.ReactNode | JSX.Element;
  placeholder?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Workspace permission view component
 * @param {WorkspacePermissionView} permission - Permission to check
 * @param {React.ReactNode} children - Children to render if permission is present
 * @param {string} className - Class name
 * @param {React.ReactNode} placeholder - Placeholder to render while loading
 * @param {React.ReactNode} unAuthorized - Children to render if permission is absent
 * @example
 * <WorkspacePermission permission="CREATE_WORKSPACE">
 *  Create
 * </WorkspacePermission>
 */
export function WorkspacePermissionView({
  permission,
  children,
  className,
  placeholder,
  unAuthorized,
  additionalCheck = true,
}: Props) {
  const { activeWorkspace, loading, error } = useWorkspaces();
  if (loading) {
    return <div className={cx(className)}>{placeholder}</div>;
  }

  return (
    <Fold
      value={
        checkWorkspacePermissions(activeWorkspace?.role, permission) &&
        additionalCheck
      }
      ifPresent={(value: any) => (
        <div className={cx(className)}>{children}</div>
      )}
      ifAbsent={() => unAuthorized}
    />
  );
}
