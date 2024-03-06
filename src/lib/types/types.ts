import { Visibility } from "../models/workspace.model";

export interface Team {
  _id: string;
  name: string;
  description: string;
  members: Member[];
  projectUsers: ProjectUsers[];
  plan: Plan;
  meta: Meta;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  billingCycleStart: number;
  inviteCode: string;
}

export interface Member {
  user: string;
  role: "admin" | "member";
  _id: string;
}
export interface ProjectUsers {
  _id: string;
  role: "admin" | "member";
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
  role: "owner" | "member";
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
  /**
   * @deprecated title is deprecated, use name instead
   */
  title: string;
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
