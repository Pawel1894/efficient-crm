import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { Lead } from "@prisma/client";
import { z } from "zod";

export const leadRouter = createTRPCRouter({
  recentlyUpdated: protectedProcedure.input(z.string().optional()).query(async ({ ctx, input }) => {
    let leads: Lead[] = [];

    if (!input) {
      return [];
    }

    if (ctx.user.role === "admin") {
      leads = await ctx.prisma.lead.findMany({
        where: {
          team: input,
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 5,
      });
    } else {
      leads = await ctx.prisma.lead.findMany({
        where: {
          owner: ctx.user.id,
          AND: {
            team: input,
          },
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 5,
      });
    }
    return leads;
  }),
});
