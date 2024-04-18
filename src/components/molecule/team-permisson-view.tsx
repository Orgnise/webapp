import { TeamPermission, checkPermissions } from "@/lib/constants/team-role";
import useTeam from "@/lib/swr/use-team";
import { Fold } from "@/lib/utils";
import cx from "classnames";
import React from "react";

export interface Props {
  className?: string;
  permission: TeamPermission;
  unAuthorized?: React.ReactNode | JSX.Element;
  placeholder?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Permission view component
 * @param {TeamPermissionView} permission - Permission to check
 * @param {React.ReactNode} children - Children to render if permission is present
 * @param {string} className - Class name
 * @param {React.ReactNode} placeholder - Placeholder to render while loading
 * @param {React.ReactNode} unAuthorized - Children to render if permission is absent
 * @example
 * <TeamPermission permission="CREATE_WORKSPACE">
 *  Create
 * </TeamPermission>
 */
function TeamPermissionView({
  permission,
  children,
  className,
  placeholder,
  unAuthorized,
}: Props) {
  const { loading, team } = useTeam();
  if (loading) {
    return <div className={cx(className)}>{placeholder}</div>;
  }

  return (
    <Fold
      value={checkPermissions(team.role, permission)}
      ifPresent={(value: any) => (
        <div className={cx(className)}>{children}</div>
      )}
      ifAbsent={() => unAuthorized}
    />
  );
}

export default TeamPermissionView;
