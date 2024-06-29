import TeamBillingPageClient from "./billing-page-client";

export default function TeamBillingPage() {
  return (
    <TeamBillingPageClient
      PADDLE_SECRET_CLIENT_KEY={process.env.PADDLE_SECRET_CLIENT_KEY}
      PADDLE_ENV={process.env.PADDLE_ENV as any}
    />
  );
}
