// const logTypeToEnv = {
//   alerts: process.env.ORGNISE_SLACK_HOOK_ALERTS,
//   tada: process.env.ORGNISE_SLACK_HOOK_NEW_TEAM,
//   waitlist: process.env.ORGNISE_SLACK_HOOK_NEW_TEAM,
//   errors: process.env.ORGNISE_SLACK_HOOK_ERRORS,
// };

export const log = async ({
  message,
  type,
  mention = false,
}: {
  message: string;
  type?: "alerts" | 'tada' | "errors" | "waitlist" | 'success'
  mention?: boolean;
}) => {
  if (
    process.env.NODE_ENV === "development" ||
    !process.env.ORGNISE_SLACK_HOOK_ALERTS ||
    !process.env.ORGNISE_SLACK_HOOK_ERRORS
  ) {
    console.log(message);
  }

  function switchType(type: string | undefined) {
    switch (type) {
      case "alerts":
        return "🚨 ";
      case "errors":
        return "❌ ";
      case "tada":
        return "🎉 ";
      case "success":
        return "✅ ";
      case "waitlist":
        return "📝 ";
      default:
        return "";
    }
  }
  /* Log a message to the console */
  const HOOK = process.env.ORGNISE_SLACK_HOOK_ALERTS;
  if (!HOOK) return;
  try {
    return await fetch(HOOK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        blocks: [
          {
            type: "section",
            text: {
              type: "mrkdwn",
              // prettier-ignore
              text: `${switchType(type)}${message}`,
            },
          },
        ],
      }),
    });
  } catch (e) {
    console.log(`Failed to log to Orgnise Slack. Error: ${e}`);
  }
};
