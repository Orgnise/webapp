// import Mongoose from "mongoose";
import { TeamRole } from "@/lib/constants/team-role";
import { ObjectId } from "mongodb";
import { Plan } from "../types/types";
import { LimitSchema } from "../zod/schemas";
import z from "../zod";
import { CollectionMode, Interval, SubscriptionManagement, SubscriptionScheduledChangeNotification, SubscriptionStatus, SubscriptionTimePeriodNotification } from "@paddle/paddle-node-sdk";

export interface TeamDbSchema {
  _id: ObjectId;
  name: string;
  description?: string;
  createdBy: ObjectId;
  plan: Plan;
  subscriptionId?: string;
  meta: MetaSchema;
  createdAt: Date;
  billingCycleStart: number;
  inviteCode: string;
  logo: string;
  updatedAt: Date;
  subscription: Subscription;
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


export interface Subscription {
  id: string;
  priceId: string;
  status: SubscriptionStatus;
  productId: string;
  canceledAt?: Date | null;
  scheduledChange?: SubscriptionScheduledChangeNotification | null;
  nextBilledAt?: Date | null;
  pausedAt?: Date | null;
  interval?: Interval;
  SubscriptionManagementUrls?: SubscriptionManagement | null;
  collectionMode?: CollectionMode;
  currentBillingPeriod: SubscriptionTimePeriodNotification | null;
}

