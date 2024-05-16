import { withTeam } from "@/lib/auth";
import { APP_DOMAIN, COUNTRIES_SHORT_NAMES } from "@/lib/constants";
import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export const POST = withTeam(async ({ req, team, session }) => {
  try {
    let { plan, period, baseUrl, comparePlans } = await req.json();

    if (!plan || !period) {
      return new Response("Invalid plan or period", { status: 400 });
    }

    plan = plan.replace(" ", "+");

    const prices = await stripe.prices.list({
      lookup_keys: [`${plan}_${period}`],
    });
    // console.log(prices);
    if (!prices.data.length) {
      return NextResponse.json(`Invalid plan or period: ${plan}_${period}`, { status: 400 });
    }

    const subscription = team.stripeId
      ? await stripe.subscriptions.list({
        customer: team.stripeId,
        status: "active",
      })
      : null;

    console.log(`\n 👉 StripeId: ${team.stripeId}. Subscription: ${subscription?.data.length}. Plan: ${plan}_${period}`);

    // if the user already has a subscription, create billing portal to upgrade
    if (team.stripeId && subscription && subscription.data.length > 0) {
      console.log("\n👉 User already has a subscription. Creating billing portal session");
      console.log('\n', {
        subscription: subscription.data[0].id,
        items: [
          {
            id: subscription.data[0].items.data[0].id,
            quantity: 1,
            price: prices.data[0].id,
          },
        ],
      })
      console.log('\n ');
      const { url } = await stripe.billingPortal.sessions.create({
        customer: team.stripeId,
        return_url: `${baseUrl}?upgrade=${plan}`,
        flow_data: comparePlans
          ? {
            type: "subscription_update",
            subscription_update: {
              subscription: subscription.data[0].id,
            },
          }
          : {
            type: "subscription_update_confirm",
            subscription_update_confirm: {
              subscription: subscription.data[0].id,
              items: [
                {
                  id: subscription.data[0].items.data[0].id,
                  quantity: 1,
                  price: prices.data[0].id,
                },
              ],
            },
          },
      });

      return NextResponse.json(url, { status: 200 });

      // if the user does not have a subscription, create a new checkout session
    } else {
      const stripeSession = await stripe.checkout.sessions.create({
        customer_email: session.user.email,
        billing_address_collection: "required",
        success_url: `${APP_DOMAIN}/${team.meta.slug}/settings/billing?success=true`,
        cancel_url: `${baseUrl}?upgrade=${plan}`,
        line_items: [{ price: prices.data[0].id, quantity: 1 }],
        shipping_address_collection: {
          allowed_countries: COUNTRIES_SHORT_NAMES as Array<any>
        },
        tax_id_collection: {
          enabled: true,
        },
        mode: "subscription",
        allow_promotion_codes: true,
        client_reference_id: team._id.toString(),
      });

      return NextResponse.json(stripeSession);
    }
  }
  catch (error) {
    console.log(error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
});
