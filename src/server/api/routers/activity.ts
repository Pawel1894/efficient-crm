import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { Activity } from "@prisma/client";
import dayjs from "dayjs";
import { z } from "zod";

export const activityRouter = createTRPCRouter({
  incoming: protectedProcedure.input(z.string().optional()).query(async ({ ctx, input }) => {
    if (!input) {
      return [];
    }

    const where: { owner?: string | null; team: string; AND: { date: { gt: string; lt: string } } } = {
      team: input,
      AND: {
        date: {
          gt: dayjs().startOf("day").subtract(1, "day").toISOString(),
          lt: dayjs().startOf("day").add(2, "day").toISOString(),
        },
      },
    };

    if (ctx.user.role !== "admin") {
      where.owner = ctx.user.id;
    }

    const activities = await ctx.prisma.activity.findMany({
      where: where,
      orderBy: {
        date: "desc",
      },
      include: {
        contact: true,
        lead: true,
        status: true,
      },
      take: 5,
    });

    return activities;
  }),
});
