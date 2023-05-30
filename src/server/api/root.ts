import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { systemRouter } from "./routers/system";
import { leadRouter } from "./routers/lead";
import { activityRouter } from "./routers/activity";
import { dictionaryRouter } from "./routers/dictionary";
import { dealRouter } from "./routers/deal";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  system: systemRouter,
  lead: leadRouter,
  activity: activityRouter,
  dictionary: dictionaryRouter,
  deal: dealRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
