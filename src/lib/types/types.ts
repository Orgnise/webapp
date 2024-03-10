import { Role } from "../schema/team.schema";
import { Visibility } from "../schema/workspace.schema";

export interface Team {
  _id: string;
  name: string;
  description: string;
  teamMembers: ProjectUsers[];
  role: Role;
  plan: Plan;
  meta: Meta;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  billingCycleStart: number;
  inviteCode: string;
  membersLimit: number;
  workspaceLimit: number;
}

export interface Member {
  user: string;
  role: Role;
  _id: string;
}
export interface ProjectUsers {
  _id: string;
  role: Role;
  user: User;
  projectId: string;
  createdAt: string;
  updatedAt: string;
}
export interface UserProps {
  _id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: Date;
  role: Role;
  projects?: { projectId: string }[];
}

export interface Meta {
  title: string;
  description: string;
  slug: string;
}

export type Plan = "free" | "pro" | "business" | "enterprise";

export interface Workspace {
  _id: string;
  team: string;
  name: string;
  description: string;
  members: Member[];
  visibility: keyof typeof Visibility;
  createdBy: any;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  meta: Meta;
}

export interface User {
  name: string;
  email: string;
  id: string;
}

export interface Collection {
  _id: string;
  children: any;
  parent: any;
  team: Team;
  name: string;
  content: any;
  sortIndex: number;
  createdAt: string;
  updatedAt: string;
  updatedBy: string;
  workspace: Workspace;
  meta: Meta;
  object?: "item" | "collection";
}
