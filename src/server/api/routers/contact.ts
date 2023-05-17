import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { Contact } from "@prisma/client";
import { z } from "zod";

export const contactRouter = createTRPCRouter({
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

    const contacts = await ctx.prisma.contact.findMany({
      where: where,
      orderBy: {
        updatedAt: "desc",
      },
      take: 5,
    });

    return contacts;
  }),
  contacts: protectedProcedure.query(async ({ ctx }) => {
    const where: { owner?: string | null } = {};

    if (ctx.user.role !== "admin") {
      where.owner = ctx.user.id;
    }

    const results = await ctx.prisma.contact.findMany({
      where: where,
      orderBy: {
        updatedAt: "desc",
      },
    });

    return results;
  }),
});
