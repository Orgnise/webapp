import { paddle } from "@/app/api/callback/paddle/route";
import { withTeam } from "@/lib/auth";
import { NextResponse } from "next/server";

export const POST = withTeam(async ({ req, team }) => {
  try {
    let { priceId } = await req.json();

    if (!priceId || !team.subscriptionId) {
      return new Response("Missing priceId or subscription ID", { status: 400 });
    }

    const subscription = await paddle.subscriptions.update(team.subscriptionId!, {
      items: [{ priceId: priceId, quantity: 1 }],
      onPaymentFailure: 'prevent_change',
      prorationBillingMode: 'prorated_immediately',

    });

    return NextResponse.json(subscription, { status: 200 });

  }
  catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
});
