const logTypeToEnv = {
  alerts: process.env.ORGNISE_SLACK_HOOK_ALERTS,
  newTeam: process.env.ORGNISE_SLACK_HOOK_NEW_TEAM,
  waitlist: process.env.ORGNISE_SLACK_HOOK_NEW_TEAM,
  errors: process.env.ORGNISE_SLACK_HOOK_ERRORS,
};

export const log = async ({
  message,
  type,
  mention = false,
}: {
  message: string;
  type: "alerts" | 'newTeam' | "errors" | "waitlist";
  mention?: boolean;
}) => {
  if (
    process.env.NODE_ENV === "development" ||
    !process.env.ORGNISE_SLACK_HOOK_ALERTS ||
    !process.env.ORGNISE_SLACK_HOOK_ERRORS
  ) {
    console.log(message);
  }
  /* Log a message to the console */
  const HOOK = logTypeToEnv[type];
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
              text: `${mention ? "<#D06Q02G3Y9L> " : ""}${(type === "alerts" || type === "errors") ? ":alert: " : ""}${message}`,
            },
          },
        ],
      }),
    });
  } catch (e) {
    console.log(`Failed to log to Orgnise Slack. Error: ${e}`);
  }
};
