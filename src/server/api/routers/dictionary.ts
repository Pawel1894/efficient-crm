import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

const TypeSchema = z.union([z.literal("ACTIVITY_STATUS"), z.literal("DEAL_STAGE"), z.literal("LEAD_STATUS")]);
export const dictionaryRouter = createTRPCRouter({
  byType: protectedProcedure.input(TypeSchema).query(async ({ ctx, input }) => {
    if (!ctx.user.orgId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Org id not found",
      });
    }

    return ctx.prisma.dictionary.findMany({
      where: {
        type: input,
        AND: {
          orgId: ctx.user.orgId,
        },
      },
      orderBy: {
        label: "desc",
      },
    });
  }),
  createDicts: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    await ctx.prisma.dictionary.createMany({
      data: [
        {
          type: "ACTIVITY_STATUS",
          label: "open",
          value: "open",
          orgId: input,
        },
        {
          type: "ACTIVITY_STATUS",
          label: "active",
          value: "active",
          orgId: input,
        },
        {
          type: "ACTIVITY_STATUS",
          label: "closed",
          value: "closed",
          orgId: input,
        },
        {
          type: "DEAL_STAGE",
          label: "open",
          value: "open",
          orgId: input,
        },
        {
          type: "DEAL_STAGE",
          label: "active",
          value: "active",
          orgId: input,
        },
        {
          type: "DEAL_STAGE",
          label: "closed",
          value: "closed",
          orgId: input,
        },
        {
          type: "LEAD_STATUS",
          label: "open",
          value: "open",
          orgId: input,
        },
        {
          type: "LEAD_STATUS",
          label: "active",
          value: "active",
          orgId: input,
        },
        {
          type: "LEAD_STATUS",
          label: "closed",
          value: "closed",
          orgId: input,
        },
      ],
    });
  }),
});
