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
  limit: z.infer<typeof LimitSchema>;
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
