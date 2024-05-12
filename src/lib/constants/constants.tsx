export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Orgnise";

export const APP_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://app.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? `https://preview.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
      : "http://localhost:3000";

export const HOME_DOMAIN = `https://${process.env.NEXT_PUBLIC_APP_DOMAIN}`;

export const API_HOSTNAMES = new Set([
  `api.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
  `api-staging.${process.env.NEXT_PUBLIC_APP_DOMAIN}`,
  "api.localhost:8888",
]);

export const API_DOMAIN =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `https://api.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
    : process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
      ? `https://api-staging.${process.env.NEXT_PUBLIC_APP_DOMAIN}`
      : "http://api.localhost:8888";

export const ORGNISE_LOGO = "https://app.orgnise.in/_static/logo.png";

export const TWO_WEEKS_IN_SECONDS = 60 * 60 * 24 * 14;

export const DEFAULT_REDIRECTS = {
  home: "https://orgnise.in",
  orgnise: "https://orgnise.in",
  signin: "https://app.orgnise.in/signin",
  login: "https://app.orgnise.in/login",
  register: "https://app.orgnise.in/signup",
  signup: "https://app.orgnise.in/register",
  app: "https://app.orgnise.in",
  dashboard: "https://app.orgnise.in",
  links: "https://app.orgnise.in/links",
  settings: "https://app.orgnise.in/settings",
  welcome: "https://app.orgnise.in/welcome",
  invites: "https://app.orgnise.in/invites",
  policy: "https://orgnise.in/policy",
  terms: "https://orgnise.in/terms",
  create: "https://app.orgnise.in/create",
  new: "https://app.orgnise.in/new",
};

export const DICEBEAR_AVATAR_URL =
  "https://api.dicebear.com/8.x/initials/svg?backgroundType=gradientLinear&fontFamily=Helvetica&fontSize=40&size=40&seed=";
