import { APP_DOMAIN } from "@/lib/constants";
import { getPlanFromPriceId } from "@/lib/constants/pricing";
import { TeamDbSchema } from "@/lib/db-schema";
import { log } from "@/lib/functions/log";
import { collections, databaseName } from "@/lib/mongodb";
import { MongoClient } from "mongodb";
import type Stripe from "stripe";

// Handle event "customer.subscription.updated"
export async function customerSubscriptionUpdated(event: Stripe.Event, client: MongoClient) {

  const teamsCollection = collections<TeamDbSchema>(client, "teams");
  const subscriptionUpdated = event.data.object as Stripe.Subscription;
  const priceId = subscriptionUpdated.items.data[0].price.id;
  const cancelPlanOn = subscriptionUpdated.cancel_at_period_end;
  const canceledAt = subscriptionUpdated.canceled_at;
  const cancellationDetails = subscriptionUpdated.cancellation_details;

  const previousAttribute = event.data.previous_attributes as any;
  const plan = getPlanFromPriceId(priceId);

  if (!plan) {
    await log({
      message: "Invalid price ID in `customer.subscription.updated` event: " + priceId,
      type: "errors",
    });
    return;
  }

  const subscriptionId = subscriptionUpdated.customer.toString();

  const team = await teamsCollection.findOne({ subscriptionId: subscriptionId }) as TeamDbSchema;
  if (!team) {
    await log({
      message: "Team with  Stripe ID `" + subscriptionId + "` not found in Stripe webhook `customer.subscription.updated` callback",
      type: "errors",
    });
    return;
  }

  const newPlan = plan.name.toLowerCase();
  if (canceledAt && cancelPlanOn && cancellationDetails?.reason === 'cancellation_requested') {
    log({
      message: ":cry: Team " + `<${APP_DOMAIN}/${team.meta.slug}|${team.name}>` + " has cancelled their " + plan.name + "` subscription",
    })
    // Todo: Handle cancellation
    return;
  }
  else if (previousAttribute?.cancel_at && previousAttribute?.cancel_at_period_end && previousAttribute?.cancellation_details.reason == 'cancellation_requested') {
    log({
      message: "Team " + `<${APP_DOMAIN}/${team.meta.slug}|${team.name}>` + " has renewed their cancelled `" + plan.name + "` subscription",
      type: 'tada',
    })
    // Todo: Handle renewal
    return;
  }
  // If a team upgrades/downgrades their subscription, update their usage limit in the database.
  else if (team.plan !== newPlan) {
    const result = await teamsCollection.updateOne(
      { subscriptionId: subscriptionId },
      {
        $set: {
          plan: plan.name.toLowerCase() as any,
          limit: {
            pages: plan.limits.pages!,
            users: plan.limits.users!,
            workspaces: plan.limits.workspaces!,
          }
        },
      },
    );

    log({
      message: "Team " + `<${APP_DOMAIN}/${team.meta.slug}|${team.name}>` + " upgraded from `" + team.plan + "` to `" + plan.name + "` plan",
      type: 'tada',
    })
  }
}