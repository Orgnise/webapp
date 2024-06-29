import { log } from "@/lib/functions/log";
import mongodb from "@/lib/mongodb";
import { Environment, EventEntity, EventName, LogLevel, Paddle } from '@paddle/paddle-node-sdk';
import { NextResponse } from "next/server";
import { subscriptionActivated } from "./subscription.activated";
import { subscriptionUpdated } from "./subscription.updated";
import { subscriptionCanceled } from "./subscription.canceled";

const relevantEvents = new Set([
  "subscription.activated",
  "subscription.updated",
  "subscription.canceled",
])

export const paddle = new Paddle(process.env.PADDLE_SERVER_SECRET_KEY ?? "", { environment: process.env.PADDLE_ENV === 'production' ? Environment.production : Environment.sandbox, logLevel: LogLevel.verbose });

// POST /api/callback/paddle – listen to Paddle webhooks
export const POST = async (req: Request) => {
  try {
    const buf = await req.text();
    const signature = req.headers.get("Paddle-Signature") as string;
    const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET;
    let event: EventEntity | null;

    try {
      if (!signature || !webhookSecret) {
        console.log("❌ Invalid signature", signature, webhookSecret);
        return new Response("Invalid signature", { status: 400 });
      }
      // event = Paddle.webhooks.constructEvent(buf, signature, webhookSecret);
      event = paddle.webhooks.unmarshal(buf, webhookSecret, signature);
      if (event == null) {
        return new Response("event is null", { status: 400 });
      }
    } catch (err: any) {
      console.log(`❌ Error message: ${err.message}`);
      console.log('❌ Error:', {
        signature,
        webhookSecret
      })
      return new Response(`Webhook Error: ${err.message}`, {
        status: 400,
      });
    }
    console.log('👉 Paddle webhook event:', event);
    if (relevantEvents.has(event.eventType)) {
      console.log('\n 🪝 Paddle webhook event type:', event.eventType);
      const client = await mongodb;
      switch (event.eventType) {
        case EventName.SubscriptionActivated:
          await subscriptionActivated(event, client);
          break;
        case EventName.SubscriptionUpdated:
          await subscriptionUpdated(event, client);
          break;
        case EventName.SubscriptionCanceled:
          await subscriptionCanceled(event, client);
          break;
      }



    }
    return NextResponse.json({ received: true });
  } catch (error: any) {
    await log({
      message: `Paddle webhook failed. Error: ${error.message}`,
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