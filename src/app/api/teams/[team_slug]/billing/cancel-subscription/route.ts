import { paddle } from "@/app/api/callback/paddle/route";
import { withTeam } from "@/lib/auth";
import { TeamDbSchema } from "@/lib/db-schema";
import { collections } from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

// POST /api/teams/[team_slug]/billing/cancel-subscription - cancel paddle subscription
export const POST = withTeam(async ({ team, client }) => {
  if (!team.subscriptionId) {
    return new Response("No paddle subscription ID available", { status: 400 });
  }
  try {
    const subscriptionId = team.subscriptionId;
    const res = await paddle.subscriptions.cancel(subscriptionId, { effectiveFrom: 'next_billing_period' });

    const teams = collections<TeamDbSchema>(client, "teams");
    const result = await teams.updateOne({ _id: new ObjectId(team._id) }, {
      $set: {
        subscription: {
          priceId: res.items[0].price!.id,
          id: subscriptionId,
          status: res.status,
          productId: res.items[0].price!.productId,
          nextBilledAt: res.nextBilledAt ? new Date(res.nextBilledAt!) : undefined,
          pausedAt: res.pausedAt ? new Date(res.pausedAt) : undefined,
          SubscriptionManagementUrls: res.managementUrls,
          collectionMode: res.collectionMode,
          scheduledChange: res.scheduledChange,
          interval: res.items[0].price!.billingCycle!.interval,
          currentBillingPeriod: res.currentBillingPeriod
        },
        updatedAt: new Date()
      }
    });
    console.log('result', result);
    return NextResponse.json(res);
  } catch (error: any) {
    return NextResponse.json(error, { status: 400 });
  }
});
