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
  visibility: Visibility;
  meta: MetaSchema;
  createdAt: Date;
  updatedAt: Date;
  createdBy: ObjectId;
  updatedBy?: ObjectId;
  defaultAccess: AccessLevel
}

export const visibilities = ['private', 'public', 'archived', 'deleted'] as const;

export type Visibility = (typeof visibilities)[number];



export interface WorkspaceMemberDBSchema {
  role: WorkspaceRole,
  user: ObjectId,
  workspace: ObjectId,
  team: ObjectId,
  createdAt: Date,
  updatedAt: Date,
}