import { Visibility } from "../models/workspace.model"

export interface Team {
  _id: string
  name: string
  description: string
  createdBy: string
  members: Member[]
  plan: PlanProps
  meta: Meta
  createdAt: string
  updatedAt: string
  __v: number
}

export interface Member {
  user: string
  role: "admin" | "member"
  _id: string
}

export interface Meta {
  title: string
  description: string
  slug: string
}

export type PlanProps = "free" | "pro" | "business" | "enterprise"

export interface Workspace {
  team: string
  name: string
  description: string
  members: Member[]
  visibility:  keyof typeof Visibility
  createdBy: any
  meta: Meta
  createdAt: string
  updatedAt: string
  _id: string
}

export interface User {
  name: string
  email: string
  id: string
}

export interface Collection {
  contentMeta: ContentMeta
  object: string
  workspace: string
  children: any
  parent: any
  team: Team
  url: string
  title: string
  content: string
  index: number
  meta: Meta
  createdAt: string
  updatedAt: string
  _id: string
}

export interface ContentMeta {
  itemIds: any[]
}