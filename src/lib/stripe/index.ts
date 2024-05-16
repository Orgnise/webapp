import Stripe from "stripe";

export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY_LIVE ?? process.env.STRIPE_SECRET_KEY ?? "",
  {
    apiVersion: "2024-04-10",
    appInfo: {
      name: "Orgnise",
      version: "0.0.1",
    },
  },
);

export async function cancelSubscription(customer?: string) {
  if (!customer) return;

  try {
    const subscriptionId = await stripe.subscriptions
      .list({
        customer,
      })
      .then((res) => res.data[0].id);

    return await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
      cancellation_details: {
        comment: "Customer deleted their Orgnise team.",
      },
    });
  } catch (error) {
    console.log("Error cancelling Stripe subscription", error);
    return;
  }
}
