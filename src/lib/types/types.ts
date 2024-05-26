import { TeamRole } from "@/lib/constants/team-role";
import { WorkspaceRole } from "@/lib/constants/workspace-role";
import { TeamSchema } from "@/lib/zod/schemas";
import z from "../zod";

export interface Team extends z.infer<typeof TeamSchema> {
  stripeId?: string;
}

export interface Member {
  user: string;
  role: TeamRole;
  _id: string;
}
export interface WorkspaceMemberProps {
  _id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
  role: WorkspaceRole;
}

export interface Meta {
  title: string;
  description: string;
  slug: string;
}

export type Plan = (typeof plans)[number];

export const plans = ["free", "pro", "business", "enterprise"] as const;

export interface Workspace {
  _id: string;
  team: string;
  name: string;
  description: string;
  members: Member[];
  visibility: Visibility;
  createdBy: any;
  /**
   * Role of the current auth user in the workspace
   */
  role: WorkspaceRole;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
  meta: Meta;
  /**
   * Default access level for new member in the workspace
   */
  defaultAccess: AccessLevel;
}


export const accessLevels = ["full", "read-only"] as const;

export type AccessLevel = (typeof accessLevels)[number];


export const visibilities = ['private', 'public', 'archived', 'deleted'] as const;

export type Visibility = (typeof visibilities)[number];


export interface User {
  name: string;
  email: string;
  id: string;
}

// Todo: Change item to page
export const collectionTypes = ['collection', 'item'] as const;

export type CollectionType = (typeof collectionTypes)[number];
export interface Collection {
  _id: string;
  children: Array<Collection>;
  parent: any;
  team: Team;
  name: string;
  content: any;
  sortIndex: number;
  createdAt: Date;
  updatedAt: Date;
  updatedBy: string;
  workspace: Workspace;
  meta: Meta;
  object?: CollectionType;
}

export interface Invite {
  _id: string;
  email: string;
  expires: Date;
  team: Team;
  createdAt: Date;
  role: TeamRole;
}


export interface Token {
  _id: string,
  name: string,
  hashedKey: string,
  partialKey: string,
  userId: string,
  createdAt: Date,
  lastUsed: Date,
}