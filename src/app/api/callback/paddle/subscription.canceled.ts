import { FREE_PLAN } from "@/lib/constants/pricing";
import { TeamDbSchema } from "@/lib/db-schema";
import { log } from "@/lib/functions/log";
import { databaseName } from "@/lib/mongodb";
import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getTeamOwner } from "@/lib/api";
import { sendEmailV2 } from "../../../../../emails";

import { APP_DOMAIN } from "@/lib/constants";
import { EventEntity, Subscription, SubscriptionNotification } from '@paddle/paddle-node-sdk';

// Handled subscription.canceled event
export async function subscriptionCanceled(event: EventEntity, client: MongoClient) {

  const teamsCollection = client.db(databaseName).collection<TeamDbSchema>("teams");

  const subscription = event.data as Subscription;

  const subscriptionId = subscription.id;
  const priceId = subscription.items[0].price?.id;
  const customData = subscription.customData as Record<string, any>;
  const teamId = customData?.teamId as string | undefined
  const scheduledChange = subscription.scheduledChange;
  const interval = subscription.items[0].price?.billingCycle?.interval;
  const status = subscription.status;
  const productId = subscription.items[0].price?.productId;
  const nextBilledAt = subscription.nextBilledAt;
  const pausedAt = subscription.pausedAt;
  const canceledAt = subscription.canceledAt;

  if (!subscriptionId || !teamId) {
    await log({
      message: `Missing subscriptionId:${subscriptionId} or teamId : ${subscriptionId} in Paddle webhook callback in Paddle webhook \`subscription.canceled\` callback`,
      type: "errors",
    });
    return;
  }

  // If a team deletes their subscription, reset their usage limit in the database to 1000.
  // Also remove the root domain redirect for all their domains from Redis.
  console.log('\n 👉 Cancelling subscription for subscriptionId:', subscriptionId)
  const team = await teamsCollection.findOne({ _id: new ObjectId(teamId) });
  if (!team) {
    await log({
      message:
        "Team with team ID *`" +
        teamId +
        "`* not found in Paddle webhook `subscription.canceled` callback",
      type: "errors",
    });
    return;
  }
  console.log('\n 👉 Cancelling subscription for team:', team._id, team.meta.slug, team.plan, team.subscriptionId)
  const teamOwner = await getTeamOwner(client, team._id.toString());
  if (!teamOwner) {
    await log({
      message:
        "Team with Subscription ID *`" +
        subscriptionId +
        "`* does not have an owner in Paddle webhook `subscription.canceled` callback",
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
          subscriptionId: undefined,
          subscription: {
            priceId: priceId!,
            status: status,
            id: subscriptionId,
            productId: productId!,
            canceledAt: canceledAt ? new Date(canceledAt!) : undefined,
            nextBilledAt: nextBilledAt ? new Date(nextBilledAt!) : undefined,
            pausedAt: pausedAt ? new Date(pausedAt!) : undefined,
            interval: interval,
            SubscriptionManagementUrls: subscription.managementUrls,
            collectionMode: subscription.collectionMode,
            scheduledChange: scheduledChange,
            currentBillingPeriod: subscription.currentBillingPeriod
          },
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
