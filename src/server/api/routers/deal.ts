import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getUser } from "@/utils/helper";
import { DealSchema } from "@/utils/schema";
import { type OrganizationMembership } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import * as yup from "yup";
import { z } from "zod";
import { MONTHS } from "./system";
import dayjs from "dayjs";
export const dealRouter = createTRPCRouter({
  deals: protectedProcedure.input(z.string().optional()).query(async ({ ctx, input }) => {
    if (!ctx.user.orgId || !ctx.user.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No team selected",
      });
    }

    const where: {
      team: string;
      AND?: {
        leadId?: string;
        owner?: string;
        AND?: {
          owner?: string;
        };
      };
    } = {
      team: ctx.user.orgId,
    };

    if (input) {
      where.AND = {
        leadId: input,
      };
    }

    if (ctx.user.role !== "admin") {
      if (where.AND) {
        where.AND.AND = {
          owner: ctx.user.id,
        };
      } else {
        where.AND = {
          owner: ctx.user.id,
        };
      }
    }

    const results = await ctx.prisma.deal.findMany({
      where: where,
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        stage: true,
        lead: true,
      },
    });

    return results;
  }),
  create: protectedProcedure.input(DealSchema).mutation(async ({ ctx, input }) => {
    let userDetails: OrganizationMembership | undefined;

    if (ctx.user.orgId && ctx.user.id) {
      userDetails = await getUser(ctx.user.orgId, ctx.user.id);
    }

    if (!userDetails) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Saving deal failed, please refresh and try again.",
      });
    }

    if (!ctx.user.orgId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No team selected",
      });
    }

    const { owner: _, stage: __, lead: ___, ...params } = input;

    const deal = await ctx.prisma.deal.create({
      data: {
        ...params,
        owner: input.owner?.userId,
        ownerFullname: input.owner?.identifier,
        dictionaryId: input.stage,
        updatedBy: userDetails.publicUserData?.identifier ?? "undefined",
        createdBy: userDetails.publicUserData?.identifier ?? "undefined",
        team: ctx.user.orgId,
        month: MONTHS[dayjs().get("month")]!,
        teamName: userDetails.organization.name,
        leadId: input.lead,
      },
    });

    return deal;
  }),
  update: protectedProcedure
    .input(
      yup.object({
        id: yup.string(),
        data: DealSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      let userDetails: OrganizationMembership | undefined;

      if (ctx.user.orgId && ctx.user.id) {
        userDetails = await getUser(ctx.user.orgId, ctx.user.id);
      }

      if (!userDetails) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Saving deal failed, please refresh and try again.",
        });
      }

      const { owner: _, stage: __, lead: ___, ...params } = input.data;

      const deal = await ctx.prisma.deal.update({
        where: {
          id: input.id,
        },
        data: {
          ...params,
          owner: input.data.owner?.userId,
          ownerFullname: input.data.owner?.identifier,
          dictionaryId: input.data.stage,
          updatedBy: userDetails.publicUserData?.identifier ?? "undefined",
          teamName: userDetails.organization.name,
          month: MONTHS[dayjs().get("month")]!,
          leadId: input.data.lead,
        },
      });

      return deal;
    }),
  delete: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    await ctx.prisma.deal.delete({
      where: {
        id: input,
      },
    });
  }),
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    if (!ctx.user.orgId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No team selected",
      });
    }

    const deal = await ctx.prisma.deal.findFirst({
      where: {
        id: input,
        AND: {
          team: ctx.user.orgId,
        },
      },
      include: {
        lead: true,
        stage: true,
      },
    });

    if (ctx.user.role !== "admin" && deal?.owner !== ctx.user.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not allowed to view this deal",
      });
    }

    if (deal === null) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Deal not found",
      });
    }

    return deal;
  }),
  assignStage: protectedProcedure
    .input(
      z.object({
        stage: z.object({
          id: z.string(),
          label: z.string(),
          orgId: z.string(),
          type: z.string(),
          value: z.string(),
        }),
        dealId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.deal.update({
        where: {
          id: input.dealId,
        },
        data: {
          dictionaryId: input.stage.id,
        },
      });
    }),
  assignOwner: protectedProcedure
    .input(
      z.object({
        owner: z.object({
          id: z.string(),
          fullname: z.string(),
        }),
        dealId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.deal.update({
        where: {
          id: input.dealId,
        },
        data: {
          owner: input.owner.id,
          ownerFullname: input.owner.fullname,
        },
      });
    }),
});
