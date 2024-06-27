import TeamBillingPageClient from "./billing-page-client";

export default function TeamBillingPage() {
  return (
    <TeamBillingPageClient
      PADDLE_SECRET_CLIENT_KEY={process.env.PADDLE_SECRET_CLIENT_KEY}
    />
  );
}
