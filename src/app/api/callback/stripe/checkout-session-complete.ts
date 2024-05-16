import { getPlanFromPriceId } from "@/lib/constants/pricing";
import { TeamDbSchema } from "@/lib/db-schema";
import { log } from "@/lib/functions/log";
import { databaseName } from "@/lib/mongodb";
import { stripe } from "@/lib/stripe";
import { MongoClient, ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import { getTeamOwner } from "@/lib/api";
import { sendEmailV2 } from "../../../../../emails";
import UpgradeEmail from "../../../../../emails/upgrade-email";

import type Stripe from "stripe";

// Handle event "checkout.session.completed"
export async function checkoutSessionCompleted(event: Stripe.Event, client: MongoClient) {

  const teamsCollection = client.db(databaseName).collection<TeamDbSchema>("teams");

  const checkoutSession = event.data.object as Stripe.Checkout.Session;

  if (
    checkoutSession.client_reference_id === null ||
    checkoutSession.customer === null
  ) {
    await log({
      message: "Missing items in Stripe webhook callback",
      type: "errors",
    });
    return;
  }

  const subscription = await stripe.subscriptions.retrieve(
    checkoutSession.subscription as string,
  );
  const priceId = subscription.items.data[0].price.id;

  const plan = getPlanFromPriceId(priceId);

  if (!plan) {
    await log({
      message: `Invalid price ID in checkout.session.completed event: ${priceId}`,
      type: "errors",
    });
    return;
  }

  const stripeId = checkoutSession.customer.toString();


  // when the team subscribes to a plan, set their stripe customer ID
  // in the database for easy identification in future webhook events
  // also update the billingCycleStart to today's date
  const result = await teamsCollection.updateOne(
    { _id: new ObjectId(checkoutSession.client_reference_id) },
    {
      $set: {
        stripeId,
        billingCycleStart: new Date().getDate(),
        plan: plan.name.toLowerCase() as any,
        pagesLimit: plan.limits.pages!,
        membersLimit: plan.limits.users!,
        workspaceLimit: plan.limits.workspace!,
      },
    },
  );

  if (result.acknowledged) {
    const teamOwner = await getTeamOwner(client, checkoutSession.client_reference_id.toString());
    if (!teamOwner) {
      await log({
        message:
          "Team with Stripe ID *`" +
          stripeId +
          "`* does not have an owner",
        type: "errors",
      });
      return;
    }
    await sendEmailV2({
      identifier: teamOwner.email!,
      subject: `Thank you for upgrading to Dub.co ${plan.name}!`,
      react: UpgradeEmail({
        name: teamOwner.name,
        email: teamOwner.email as string,
        plan: plan.name,
      })
    });
    log({
      message: "Team with ID `" + checkoutSession.client_reference_id + "`upgraded to ${plan.name} plan",
      type: 'success',
    })
  } else {
    log({
      message: `Failed to update team with ID ${checkoutSession.client_reference_id} in Stripe webhook callback`,
      type: "errors",
    })
  }
}
