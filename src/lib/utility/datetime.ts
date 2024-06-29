import ms from "ms";

export const getFirstAndLastDay = (day: number) => {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  if (currentDay >= day) {
    // if the current day is greater than target day, it means that we just passed it
    return {
      firstDay: new Date(currentYear, currentMonth, day),
      lastDay: new Date(currentYear, currentMonth + 1, day - 1),
    };
  } else {
    // if the current day is less than target day, it means that we haven't passed it yet
    const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear; // if the current month is January, we need to go back a year
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1; // if the current month is January, we need to go back to December
    return {
      firstDay: new Date(lastYear, lastMonth, day),
      lastDay: new Date(currentYear, currentMonth, day - 1),
    };
  }
};

export const getFirstAndLastDay2 = (day: number, interval: "month" | "year") => {
  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  if (interval === "month") {
    if (currentDay >= day) {
      // if the current day is greater than target day, it means that we just passed it
      return {
        firstDay: new Date(currentYear, currentMonth, day),
        lastDay: new Date(currentYear, currentMonth + 1, day - 1),
      };
    } else {
      // if the current day is less than target day, it means that we haven't passed it yet
      const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      return {
        firstDay: new Date(currentYear, lastMonth, day),
        lastDay: new Date(currentYear, currentMonth, day - 1),
      };
    }
  } else if (interval === "year") {
    if (currentDay >= day) {
      // if the current day is greater than target day, it means that we just passed it
      return {
        firstDay: new Date(currentYear, currentMonth, day),
        lastDay: new Date(currentYear + 1, currentMonth, day - 1),
      };
    } else {
      // if the current day is less than target day, it means that we haven't passed it yet
      const lastYear = currentYear - 1;
      return {
        firstDay: new Date(lastYear, currentMonth, day),
        lastDay: new Date(currentYear, currentMonth, day - 1),
      };
    }
  } else {
    throw new Error("Invalid interval. It must be either 'month' or 'year'.");
  }
};
/**
 * Returns a string representing the time elapsed since the given timestamp.
 * @param timestamp - The timestamp to compare to the current time.
 * @param withAgo - Whether to append "ago" to the result.
 * @returns A string representing the time elapsed since the given timestamp.
 * @example
 * timeAgo(new Date("2021-01-01T00:00:00Z"), { withAgo: true });
 * // "9 months ago"
 * @example
 */
export const timeAgo = (
  timestamp: Date | null,
  {
    withAgo,
  }: {
    withAgo?: boolean;
  } = {},
): string => {
  if (!timestamp) return "Never";
  const diff = Date.now() - new Date(timestamp).getTime();
  if (diff < 1000) {
    // less than 1 second
    return "Just now";
  } else if (diff > 82800000) {
    // more than 23 hours – similar to how Twitter displays timestamps
    return new Date(timestamp).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year:
        new Date(timestamp).getFullYear() !== new Date().getFullYear()
          ? "numeric"
          : undefined,
    });
  }
  return `${ms(diff)}${withAgo ? " ago" : ""}`;
};
