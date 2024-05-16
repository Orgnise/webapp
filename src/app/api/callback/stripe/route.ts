import { FREE_PLAN, getPlanFromPriceId } from "@/lib/constants/pricing";
import { TeamDbSchema, TeamMemberDbSchema } from "@/lib/db-schema";
import { log } from "@/lib/functions/log";
import mongodb, { databaseName } from "@/lib/mongodb";
import { stripe } from "@/lib/stripe";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { sendEmailV2 } from "../../../../../emails";

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

// POST /api/callback/stripe – listen to Stripe webhooks
export const POST = async (req: Request) => {
  const buf = await req.text();
  const sig = req.headers.get("Stripe-Signature") as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event: Stripe.Event;

  try {
    if (!sig || !webhookSecret) return;
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret);
  } catch (err: any) {
    console.log(`❌ Error message: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, {
      status: 400,
    });
  }
  if (relevantEvents.has(event.type)) {
    console.log('Stripe webhook event type:', event);
    const client = await mongodb;
    const teamsCollection = client.db(databaseName).collection<TeamDbSchema>("teams");
    try {
      if (event.type === "checkout.session.completed") {
        const checkoutSession = event.data.object as Stripe.Checkout.Session;

        if (
          checkoutSession.client_reference_id === null ||
          checkoutSession.customer === null
        ) {
          await log({
            message: "Missing items in Stripe webhook callback",
            type: "errors",
          });
          return NextResponse.json({ received: true });
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

        if (!result.acknowledged) {
          log({
            message: `Failed to update team with ID ${checkoutSession.client_reference_id} in Stripe webhook callback`,
            type: "errors",
          })
        }
      }

      // for subscription updates
      if (event.type === "customer.subscription.updated") {
        const subscriptionUpdated = event.data.object as Stripe.Subscription;
        const priceId = subscriptionUpdated.items.data[0].price.id;

        const plan = getPlanFromPriceId(priceId);

        if (!plan) {
          await log({
            message: `Invalid price ID in customer.subscription.updated event: ${priceId}`,
            type: "errors",
          });
          return;
        }

        const stripeId = subscriptionUpdated.customer.toString();

        const team = await teamsCollection.findOne({ stripeId });

        if (!team) {
          await log({
            message:
              "Team with Stripe ID *`" +
              stripeId +
              "`* not found in Stripe webhook `customer.subscription.updated` callback",
            type: "errors",
          });
          return NextResponse.json({ received: true });
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

          if (!result.acknowledged) {
            log({
              message: `Failed to update team with Stripe ID ${stripeId} in Stripe webhook callback`,
              type: "errors",
            });
          }
        }
      }

      // If team cancels their subscription
      if (event.type === "customer.subscription.deleted") {
        const subscriptionDeleted = event.data.object as Stripe.Subscription;

        const stripeId = subscriptionDeleted.customer.toString();

        // If a team deletes their subscription, reset their usage limit in the database to 1000.
        // Also remove the root domain redirect for all their domains from Redis.
        console.log('\n 👉 Cancelling subscription for team:', stripeId)
        const team = await teamsCollection.findOne({ stripeId: stripeId });
        console.log({ team });
        if (!team) {
          await log({
            message:
              "Team with Stripe ID *`" +
              stripeId +
              "`* not found in Stripe webhook `customer.subscription.deleted` callback",
            type: "errors",
          });
          return NextResponse.json({ received: true });
        }
        console.log('\n 👉 Cancelling subscription for team:', team._id, team.meta.slug, team.plan, team.stripeId)
        const teamUsersCollection = client.db(databaseName).collection<TeamMemberDbSchema>("teamUsers");
        const teamUsers = await teamUsersCollection.aggregate([
          {
            $match: {
              teamId: team._id,
              role: "owner",
            }
          },
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $unwind: "$user",
          },
          {
            $project: {
              email: "$user.email",
            },
          },
        ]).toArray();
        const teamOwner = teamUsers?.[0];
        if (!teamOwner) {
          await log({
            message:
              "Team with Stripe ID *`" +
              stripeId +
              "`* does not have an owner",
            type: "errors",
          });
          return NextResponse.json({ received: true });
        }
        console.log('\n 👉 Updating the database for team:', teamOwner.email)
        await Promise.allSettled([
          await teamsCollection.updateOne(
            { stripeId: stripeId },
            {
              $set: {
                plan: "free",
                pagesLimit: FREE_PLAN.limits.pages!,
                membersLimit: FREE_PLAN.limits.users!,
                workspaceLimit: FREE_PLAN.limits.workspace!,
              },
            },
          ),

          log({
            message:
              ":cry: Team *`" +
              team.meta.slug +
              "`* deleted their subscription",
            type: 'alerts',// "cron",
            mention: true,
          }),

          sendEmailV2({
            identifier: teamOwner!.email!,
            subject: "Feedback on your Orgnise.in experience?",
            text: "Hey!\n\nI noticed you recently cancelled your Orgnise.in subscription - we're sorry to see you go!\n\nI'd love to hear your feedback on your experience with Orgnise what could we have done better?\n\nThanks!\n\nSonu Sharma\nFounder, Orgnise.in",
          }),

        ]);
      }

    } catch (error: any) {
      await log({
        message: `Stripe webook failed. Error: ${error.message}`,
        type: "errors",
      });
      return new Response(
        'Webhook error: "Webhook handler failed. View logs."',
        {
          status: 400,
        },
      );
    }
  } else {
    return new Response(`🤷‍♀️ Unhandled event type: ${event.type}`, {
      status: 400,
    });
  }

  return NextResponse.json({ received: true });
};