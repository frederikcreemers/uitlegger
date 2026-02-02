import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "delete stale conversations",
  { hourUTC: 0, minuteUTC: 0 },
  internal.mutations.deleteStaleConversations,
);

export default crons;
