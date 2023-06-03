import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { clerkClient } from "@clerk/nextjs";

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
  setSettings: protectedProcedure.input(z.string().nullable()).mutation(async ({ ctx, input }) => {
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
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const user = await clerkClient.users.getUser(input);

    if (!user) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User id not found",
      });
    }

    return user;
  }),
  removeTeamData: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    if (!ctx.user.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User id not found",
      });
    }
    await ctx.prisma.activity.deleteMany({
      where: {
        team: input,
      },
    });

    await ctx.prisma.deal.deleteMany({
      where: {
        team: input,
      },
    });

    await ctx.prisma.lead.deleteMany({
      where: {
        team: input,
      },
    });

    await ctx.prisma.dictionary.deleteMany({
      where: {
        orgId: input,
      },
    });
  }),
});
