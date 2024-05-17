import { withTeam } from "@/lib/auth";
import { APP_DOMAIN } from "@/lib/constants";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

// POST /api/teams/[team_slug]/billing/manage - create a Stripe billing portal session
export const POST = withTeam(async ({ team }) => {
  if (!team.stripeId) {
    return new Response("No Stripe customer ID", { status: 400 });
  }
  const { url } = await stripe.billingPortal.sessions.create({
    customer: team.stripeId,
    return_url: `${APP_DOMAIN}/${team.meta.slug}/settings/billing`,
  });
  return NextResponse.json(url);
});
