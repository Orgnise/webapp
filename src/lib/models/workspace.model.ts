import { Meta, Role } from "./team.modal";

import { ObjectId } from "mongodb";

export interface Workspace {
  _id: string;
  team: ObjectId;
  name: string;
  description: string;
  members: {
    user: ObjectId;
    role: keyof typeof Role;
  }[];
  visibility: keyof typeof Visibility;
  meta: Meta;
  createdAt: string;
  updatedAt: string;
  createdBy: ObjectId;
  updatedBy?: ObjectId;
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
