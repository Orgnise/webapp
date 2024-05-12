import { MetaSchema } from "./team.schema";
import { ObjectId } from "mongodb";
import { WorkspaceRole } from "../constants/workspace-role";
import { AccessLevel, Visibility } from "../types";

export interface WorkspaceDbSchema {
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


export interface WorkspaceMemberDBSchema {
  role: WorkspaceRole,
  user: ObjectId,
  workspace: ObjectId,
  team: ObjectId,
  createdAt: Date,
  updatedAt: Date,
}