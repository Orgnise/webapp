import { FREE_PLAN } from "@/lib/constants/pricing";
import { TeamDbSchema } from "@/lib/db-schema";
import { log } from "@/lib/functions/log";
import { databaseName } from "@/lib/mongodb";
import { MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import { getTeamOwner } from "@/lib/api";
import { sendEmailV2 } from "../../../../../emails";

import { APP_DOMAIN } from "@/lib/constants";
import type Stripe from "stripe";

// Handled customer.subscription.deleted event
export async function customerSubscriptionDeleted(event: Stripe.Event, client: MongoClient) {

  const teamsCollection = client.db(databaseName).collection<TeamDbSchema>("teams");

  const subscriptionDeleted = event.data.object as Stripe.Subscription;

  const subscriptionId = subscriptionDeleted.customer.toString();

  // If a team deletes their subscription, reset their usage limit in the database to 1000.
  // Also remove the root domain redirect for all their domains from Redis.
  console.log('\n 👉 Cancelling subscription for team:', subscriptionId)
  const team = await teamsCollection.findOne({ subscriptionId: subscriptionId });
  if (!team) {
    await log({
      message:
        "Team with Stripe ID *`" +
        subscriptionId +
        "`* not found in Stripe webhook `customer.subscription.deleted` callback",
      type: "errors",
    });
    return;
  }
  console.log('\n 👉 Cancelling subscription for team:', team._id, team.meta.slug, team.plan, team.subscriptionId)
  const teamOwner = await getTeamOwner(client, team._id.toString());
  if (!teamOwner) {
    await log({
      message:
        "Team with Stripe ID *`" +
        subscriptionId +
        "`* does not have an owner in Stripe webhook `customer.subscription.deleted` callback",
      type: "errors",
    });
    return NextResponse.json({ received: true });
  }
  console.log('\n 👉 Updating the database for team:', teamOwner.email)
  await Promise.allSettled([
    await teamsCollection.updateOne(
      { subscriptionId: subscriptionId },
      {
        $set: {
          plan: "free",
          limit: {
            pages: FREE_PLAN.limits.pages!,
            users: FREE_PLAN.limits.users!,
            workspaces: FREE_PLAN.limits.workspaces!,
          }
        },
      },
    ),

    log({
      message:
        "Team *" +
        `<${APP_DOMAIN}/${team.meta.slug}|${team.name}>` +
        "* deleted their subscription",
      type: 'alerts',
      mention: true,
    }),

    sendEmailV2({
      identifier: teamOwner!.email!,
      subject: "Feedback on your Orgnise.in experience?",
      text: `Hey!
      I noticed you recently cancelled your Orgnise.in subscription - we're sorry to see you go!
      I'd love to hear your feedback on your experience with Orgnise what could we have done better?
      Thanks!
      Sonu Sharma
      Founder, Orgnise.in`,
    }),

  ]);
}
