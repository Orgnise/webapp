// import Mongoose from "mongoose";
import { TeamRole } from "@/lib/constants/team-role";
import { ObjectId } from "mongodb";
import { Plan } from "../types/types";

export interface TeamDbSchema {
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
  logo: string;
}

export interface MetaSchema {
  title: string;
  description: string;
  slug: string;
}

export interface TeamMemberDbSchema {
  _id?: string;
  role: TeamRole;
  user: ObjectId;
  // ToDo: Rename this to team
  teamId: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
