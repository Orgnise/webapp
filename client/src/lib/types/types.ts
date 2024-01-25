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