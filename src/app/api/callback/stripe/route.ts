import { log } from "@/lib/functions/log";
import mongodb from "@/lib/mongodb";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { checkoutSessionCompleted } from "./checkout-session-complete";
import { customerSubscriptionDeleted } from "./customer-subscription-deleted";
import { customerSubscriptionUpdated } from "./customer-subscription-updated";

const relevantEvents = new Set([
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
]);

// POST /api/callback/stripe – listen to Stripe webhooks
export const POST = async (req: Request) => {
  try {
    const buf = await req.text();
    const sig = req.headers.get("Stripe-Signature") as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    console.log('👉 Stripe webhook event received:', webhookSecret);

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
      if (event.type === "checkout.session.completed") {
        await checkoutSessionCompleted(event, client);
      }

      // for subscription updates
      if (event.type === "customer.subscription.updated") {
        await customerSubscriptionUpdated(event, client);
      }

      // If team cancels their subscription
      if (event.type === "customer.subscription.deleted") {
        await customerSubscriptionDeleted(event, client);
      }
    }
    return NextResponse.json({ received: true });
  } catch (error: any) {
    await log({
      message: `Stripe webhook failed. Error: ${error.message}`,
      type: "errors",
    });
    return new Response(
      'Webhook error: "Webhook handler failed. View logs."',
      {
        status: 400,
      },
    );
  }
};