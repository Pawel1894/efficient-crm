import { createTRPCRouter } from "@/server/api/trpc";
import { userRouter } from "./routers/user";
import { systemRouter } from "./routers/system";
import { contactRouter } from "./routers/contact";
import { leadRouter } from "./routers/lead";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  user: userRouter,
  system: systemRouter,
  contact: contactRouter,
  lead: leadRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
