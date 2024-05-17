import { getPlanFromPriceId } from "@/lib/constants/pricing";
import { TeamDbSchema } from "@/lib/db-schema";
import { log } from "@/lib/functions/log";
import { databaseName } from "@/lib/mongodb";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import { APP_DOMAIN } from "@/lib/constants";
import type Stripe from "stripe";

// Handle event "customer.subscription.updated"
export async function customerSubscriptionUpdated(event: Stripe.Event, client: MongoClient) {

  const teamsCollection = client.db(databaseName).collection<TeamDbSchema>("teams");
  const subscriptionUpdated = event.data.object as Stripe.Subscription;
  const priceId = subscriptionUpdated.items.data[0].price.id;

  const plan = getPlanFromPriceId(priceId);

  if (!plan) {
    await log({
      message: "Invalid price ID in `customer.subscription.updated` event: " + priceId,
      type: "errors",
    });
    return;
  }

  const stripeId = subscriptionUpdated.customer.toString();

  const team = await teamsCollection.findOne({ stripeId });

  if (!team) {
    await log({
      message: "Team with Stripe ID *`" + stripeId + "`* not found in Stripe webhook `customer.subscription.updated` callback",
      type: "errors",
    });
    return;
  }

  const newPlan = plan.name.toLowerCase();

  // If a team upgrades/downgrades their subscription, update their usage limit in the database.
  if (team.plan !== newPlan) {
    const result = await teamsCollection.updateOne(
      { stripeId: stripeId },
      {
        $set: {
          plan: plan.name.toLowerCase() as any,
          pagesLimit: plan.limits.pages!,
          membersLimit: plan.limits.users!,
          workspaceLimit: plan.limits.workspace!,
        },
      },
    );

    log({
      message: "Team " + `<${APP_DOMAIN}/${team.meta.slug}|${team.name}>` + " upgraded from `" + team.plan + "` to `" + plan.name + "` plan",
      type: 'tada',
    })
  }
}