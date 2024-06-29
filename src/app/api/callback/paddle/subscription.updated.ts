import { APP_DOMAIN } from "@/lib/constants";
import { getPlanFromPriceId } from "@/lib/constants/pricing";
import { TeamDbSchema } from "@/lib/db-schema";
import { log } from "@/lib/functions/log";
import { collections } from "@/lib/mongodb";
import { EventEntity, SubscriptionNotification } from '@paddle/paddle-node-sdk';
import { MongoClient } from "mongodb";

// Handle event "subscription.updated"
export async function subscriptionUpdated(event: EventEntity, client: MongoClient) {

  const teamsCollection = collections<TeamDbSchema>(client, "teams");
  const subscription = event.data as SubscriptionNotification;
  const subscriptionId = subscription.id;
  const priceId = subscription.items[0].price?.id;
  const scheduledChange = subscription.scheduledChange;
  const interval = subscription.items[0].price?.billingCycle?.interval;
  const status = subscription.status;
  const productId = subscription.items[0].price?.productId;
  const nextBilledAt = subscription.nextBilledAt;
  const pausedAt = subscription.pausedAt;
  const canceledAt = subscription.canceledAt;


  const plan = getPlanFromPriceId(priceId!);

  if (!plan) {
    await log({
      message: "Invalid price ID in `subscription.updated` event: " + priceId,
      type: "errors",
    });
    return;
  }



  const team = await teamsCollection.findOne({ subscriptionId: subscriptionId }) as TeamDbSchema;
  if (!team) {
    await log({
      message: "Team with  Subscription Id `" + subscriptionId + "` not found in Paddle webhook `subscription.updated` callback",
      type: "errors",
    });
    return;
  }

  if (canceledAt || scheduledChange?.action === 'cancel') {
    log({
      message: ":cry: Team " + `<${APP_DOMAIN}/${team.meta.slug}|${team.name}>` + " has cancelled their `" + plan.name + "` subscription",
    })
    // Todo: Handle cancellation
    return;
  }

  // If a team upgrades/downgrades their subscription, update their usage limit in the database.

  const result = await teamsCollection.updateOne(
    { subscriptionId: subscriptionId },
    {
      $set: {
        plan: plan.name.toLowerCase() as any,
        subscription: {
          id: subscriptionId,
          status: status,
          priceId: priceId!,
          productId: productId!,
          scheduledChange: scheduledChange,
          canceledAt: canceledAt ? new Date(canceledAt!) : undefined,
          nextBilledAt: nextBilledAt ? new Date(nextBilledAt!) : undefined,
          pausedAt: pausedAt ? new Date(pausedAt!) : undefined,
          interval: interval,
          collectionMode: subscription.collectionMode,
          currentBillingPeriod: subscription.currentBillingPeriod
        },
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