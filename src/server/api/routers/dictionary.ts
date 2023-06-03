import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import * as yup from "yup";
import { DictionarySchema } from "@/utils/schema";
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
  delete: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only admin members can delete dictionaries",
      });
    }

    await ctx.prisma.dictionary.delete({
      where: {
        id: input,
      },
    });
  }),
  update: protectedProcedure
    .input(
      yup.object({
        id: yup.string(),
        data: DictionarySchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const type = TypeSchema.safeParse(input.data.type);

      if (!type.success) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid type ",
        });
      }

      if (ctx.user.role !== "admin") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Only admin members can update dictionaries",
        });
      }

      const dictionary = await ctx.prisma.dictionary.update({
        where: {
          id: input.id,
        },
        data: {
          ...input.data,
          type: type.data,
        },
      });

      return dictionary;
    }),
  create: protectedProcedure.input(DictionarySchema).mutation(async ({ ctx, input }) => {
    const type = TypeSchema.safeParse(input.type);

    if (!ctx.user.orgId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No current team",
      });
    }

    if (ctx.user.role !== "admin") {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "Only admin members can create dictionaries",
      });
    }

    if (!type.success) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Invalid type ",
      });
    }

    const dictionary = await ctx.prisma.dictionary.create({
      data: {
        ...input,
        type: type.data,
        orgId: ctx.user.orgId,
      },
    });

    return dictionary;
  }),

  dictionaries: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.orgId) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Org id not found",
      });
    }

    return ctx.prisma.dictionary.findMany({
      where: {
        orgId: ctx.user.orgId,
      },
      orderBy: {
        label: "desc",
      },
    });
  }),
});
