import { TeamRole } from "@/lib/constants/team-role";
import { MetaSchema } from "./team.schema";

import { ObjectId } from "mongodb";
import { AccessLevel } from "../types/types";
import { WorkspaceRole } from "../constants/workspace-role";

export interface WorkspaceSchema {
  _id: string;
  team: ObjectId;
  name: string;
  description: string;
  members: {
    user: ObjectId;
    role: TeamRole;
  }[];
  visibility: keyof typeof Visibility;
  meta: MetaSchema;
  createdAt: Date;
  updatedAt: Date;
  createdBy: ObjectId;
  updatedBy?: ObjectId;
  accessLevel: AccessLevel
}

export const Visibility = {
  Private: "private",
  Public: "public",
  Archived: "archived",
  Active: "active",
  Pending: "pending",
  Deleted: "deleted",
  Draft: "draft",
  Completed: "completed",
};


export interface WorkspaceUserDBSchema {
  role: WorkspaceRole,
  user: ObjectId,
  accessLevel: AccessLevel,
  workspace: ObjectId,
  team: ObjectId,
  createdAt: Date,
  updatedAt: Date,
}