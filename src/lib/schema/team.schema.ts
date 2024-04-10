// import Mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { Plan } from "../types/types";
// const Schema = Mongoose.Schema;

export const roles = ["owner", "moderator", "guest", "member"] as const;

export type Role = typeof roles[number];
export interface TeamSchema {
  _id: ObjectId;
  name: string;
  description?: string;
  createdBy: ObjectId;
  plan: Plan;
  teamUsers: ObjectId;
  meta: MetaSchema;
  createdAt: Date;
  billingCycleStart: number;
  inviteCode: string;
  membersLimit: number;
  workspaceLimit: number;
}

export interface MetaSchema {
  title: string;
  description: string;
  slug: string;
}


export interface TeamMemberSchema {
  _id?: string;
  role: Role;
  user: ObjectId;
  teamId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
