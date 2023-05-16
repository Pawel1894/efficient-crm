import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import type { Contact } from "@prisma/client";
import { z } from "zod";

export const contactRouter = createTRPCRouter({
  recentlyUpdated: protectedProcedure.input(z.string().optional()).query(async ({ ctx, input }) => {
    let contacts: Contact[] = [];

    if (!input) {
      return [];
    }

    if (ctx.user.role === "admin") {
      contacts = await ctx.prisma.contact.findMany({
        where: {
          team: input,
        },
        orderBy: {
          updatedAt: "desc",
        },
        take: 5,
      });
    } else {
      contacts = await ctx.prisma.contact.findMany({
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
    return contacts;
  }),
});
