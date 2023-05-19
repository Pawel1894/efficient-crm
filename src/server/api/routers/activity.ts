import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";

export const activityRouter = createTRPCRouter({
  incoming: protectedProcedure.query(async ({ ctx, input }) => {
    if (!ctx.user.orgId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot fetch activities",
      });
    }

    const where: { owner?: string | null; team: string; AND: { date: { gt: string; lt: string } } } = {
      team: ctx.user.orgId,
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
