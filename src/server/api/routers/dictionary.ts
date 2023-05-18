import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { z } from "zod";

const TypeSchema = z.union([
  z.literal("ACTIVITY_STATUS"),
  z.literal("CONTACT_TYPE"),
  z.literal("DEAL_STAGE"),
  z.literal("LEAD_STATUS"),
]);
export const dictionaryRouter = createTRPCRouter({
  byType: protectedProcedure.input(TypeSchema).query(async ({ ctx, input }) => {
    return ctx.prisma.dictionary.findMany({
      where: {
        type: input,
      },
      orderBy: {
        label: "desc",
      },
    });
  }),
});
