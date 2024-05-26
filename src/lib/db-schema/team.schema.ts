// import Mongoose from "mongoose";
import { TeamRole } from "@/lib/constants/team-role";
import { ObjectId } from "mongodb";
import { Plan } from "../types/types";
import { LimitSchema } from "../zod/schemas";
import z from "../zod";

export interface TeamDbSchema {
  _id: ObjectId;
  name: string;
  description?: string;
  createdBy: ObjectId;
  plan: Plan;
  stripeId?: string;
  meta: MetaSchema;
  createdAt: Date;
  billingCycleStart: number;
  inviteCode: string;
  logo: string;
  updatedAt: Date;
  limit: z.infer<typeof LimitSchema>;
}

export interface MetaSchema {
  title: string;
  description: string;
  slug: string;
}

export interface TeamMemberDbSchema {
  _id?: ObjectId;
  role: TeamRole;
  user: ObjectId;
  team: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
export interface TeamInviteDbSchema extends Omit<TeamMemberDbSchema, 'updatedAt' | 'user'> {
  expires: Date
}
