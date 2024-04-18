// import { plans, roles } from "@/lib/types";
import { roles } from "@/lib/constants/team-role";
import { plans } from "@/lib/types/types";
import z from "@/lib/zod";

export const planSchema = z.enum(plans).describe("The plan of the team.");

export const roleSchema = z
  .enum(roles)
  .describe("The role of the authenticated user in the team.");
