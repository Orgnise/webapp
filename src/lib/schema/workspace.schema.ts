import { TeamRole } from "@/lib/constants/team-role";
import { MetaSchema } from "./team.schema";

import { ObjectId } from "mongodb";
import { AccessLevel } from "../types/types";

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
  createdAt: string;
  updatedAt: string;
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


