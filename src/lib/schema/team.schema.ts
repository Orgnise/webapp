// import Mongoose from "mongoose";
import { ObjectId } from "mongodb";
import { Plan } from "../types/types";
// const Schema = Mongoose.Schema;

export type Role = 'owner' | 'member';
export interface TeamSchema {
  _id: ObjectId;
  name: string;
  description?: string;
  createdBy: ObjectId;
  plan: Plan;
  members: {
    user: ObjectId;
    role: Role;
  }[];
  teamUsers: ObjectId;
  meta: MetaSchema;
  createdAt: Date;
  membersCount: number;
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

export interface TeamUserSchema {
  _id?: string;
  teamId: ObjectId;
  users: {
    role: Role;
    user: ObjectId;
    teamId: ObjectId;
    createdAt: Date;
    updatedAt: Date;
  }[]
}
