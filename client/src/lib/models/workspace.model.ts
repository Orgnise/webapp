import { Meta, Role } from "./team.modal"

import { ObjectId } from "mongodb"

export interface Workspace {
    team: ObjectId
    name: string
    description: string
    members: {
        user: ObjectId,
        role: keyof typeof Role
      }[],
    visibility: keyof typeof Visibility
    createdBy: ObjectId
    meta: Meta
    createdAt: string
    updatedAt: string
    _id: string
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
