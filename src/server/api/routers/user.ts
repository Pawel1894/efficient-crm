import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const userRouter = createTRPCRouter({
  settings: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User id not found",
      });
    }

    const settings = await ctx.prisma.userControl.findFirst({
      where: {
        userId: ctx.user.id,
      },
    });
    return settings;
  }),
  setSettings: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    if (!ctx.user.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User id not found",
      });
    }
    const settings = await ctx.prisma.userControl.upsert({
      where: {
        userId: ctx.user.id,
      },
      update: {
        lastActiveOrg: input,
      },
      create: {
        userId: ctx.user.id,
        lastActiveOrg: input,
      },
    });
    return settings;
  }),
});
