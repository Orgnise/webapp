import { getTeamOwner } from "@/lib/api";
import { getPlanFromPriceId } from "@/lib/constants/pricing";
import { TeamDbSchema } from "@/lib/db-schema";
import { log } from "@/lib/functions/log";
import { databaseName } from "@/lib/mongodb";
import { MongoClient, ObjectId } from "mongodb";
import { sendEmailV2 } from "../../../../../emails";
import UpgradeEmail from "../../../../../emails/upgrade-email";

import { APP_DOMAIN } from "@/lib/constants";
import { EventEntity, SubscriptionNotification } from '@paddle/paddle-node-sdk';

// Handle event "subscription.activated"
export async function subscriptionActivated(event: EventEntity, client: MongoClient) {

  const teamsCollection = client.db(databaseName).collection<TeamDbSchema>("teams");

  const subscription = event.data as SubscriptionNotification
  const customData = subscription.customData as Record<string, any>;
  const teamId = customData.teamId as string | undefined
  const subscriptionId = subscription.id;
  const priceId = subscription.items[0].price?.id;
  const scheduledChange = subscription.scheduledChange;
  const interval = subscription.items[0].price?.billingCycle?.interval;
  const status = subscription.status;
  const productId = subscription.items[0].price?.productId;
  const nextBilledAt = subscription.nextBilledAt;
  const pausedAt = subscription.pausedAt;
  const canceledAt = subscription.canceledAt;

  if (
    !teamId
  ) {
    await log({
      message: "Missing teamId in Paddle webhook callback in Paddle webhook `subscription.activated` callback",
      type: "errors",
    });
    return;
  }


  const plan = getPlanFromPriceId(priceId!);

  if (!plan) {
    await log({
      message: "Invalid price ID:`" + `${priceId}` + '` in Paddle webhook `subscription.activated` callback',
      type: "errors",
    });
    return;
  }



  const team = await teamsCollection.findOne({ _id: new ObjectId(teamId) });

  if (!team) {
    await log({
      message:
        "Team with Paddle ID *`" +
        teamId +
        "`* not found in Paddle webhook `subscription.activated` callback",
      type: "errors",
    });
    return;
  }


  // when the team subscribes to a plan, set their Paddle customer ID
  // in the database for easy identification in future webhook events
  // also update the billingCycleStart to today's date
  const result = await teamsCollection.updateOne(
    { _id: team._id },
    {
      $set: {
        subscriptionId: subscriptionId,
        billingCycleStart: new Date().getDate(),
        plan: plan.name.toLowerCase() as any,
        subscription: {
          status: status,
          id: subscriptionId,
          productId: productId!,
          priceId: priceId!,
          canceledAt: canceledAt ? new Date(canceledAt!) : undefined,
          scheduledChange: scheduledChange,
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



  if (result.acknowledged) {
    const teamOwner = await getTeamOwner(client, teamId);
    if (!teamOwner) {
      await log({
        message:
          "Team" + `<${APP_DOMAIN}/${team.meta.slug}|${team.name}>` + " with Subscription ID *`" +
          subscriptionId +
          "`* does not have an owner in Paddle webhook `subscription.activated` callback",
        type: "errors",
      });
      return;
    }
    await sendEmailV2({
      identifier: teamOwner.email!,
      subject: `Thank you for upgrading to Orgnise.in ${plan.name}!`,
      react: UpgradeEmail({
        name: teamOwner.name,
        email: teamOwner.email as string,
        plan: plan.name,
      })
    });
    log({
      message: "Team " + `<${APP_DOMAIN}/${team.meta.slug}|${team.name}>` + " upgraded plan `free` to `" + plan.name + "` plan",
      type: 'success',
    })
  } else {
    log({
      message: `Failed to update <${APP_DOMAIN}/${team.meta.slug}|${team.name}> team with subscription Id ${subscriptionId} ` + 'in Paddle webhook `subscription.activated` callback',
      type: "errors",
    })
  }
}
