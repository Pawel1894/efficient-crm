import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

export const leadRouter = createTRPCRouter({
  recentlyUpdated: protectedProcedure.input(z.string().optional()).query(async ({ ctx, input }) => {
    if (!input) {
      return [];
    }

    const where: {
      team: string;
      AND?: {
        owner: string | null;
      };
    } = {
      team: input,
    };

    if (ctx.user.role !== "admin") {
      where.AND = {
        owner: ctx.user.id,
      };
    }

    const leads = await ctx.prisma.lead.findMany({
      where: where,
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
    });

    return leads;
  }),
});
