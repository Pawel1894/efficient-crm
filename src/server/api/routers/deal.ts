import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getUser } from "@/utils/helper";
import { DealSchema } from "@/utils/schema";
import { type OrganizationMembership } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import * as yup from "yup";
export const dealRouter = createTRPCRouter({
  deals: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.orgId || !ctx.user.id) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot fetch deals",
      });
    }

    const where: {
      team: string;
      AND?: {
        owner: string;
      };
    } = {
      team: ctx.user.orgId,
    };

    if (ctx.user.role !== "admin") {
      where.AND = {
        owner: ctx.user.id,
      };
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

    if (!userDetails || !ctx.user.orgId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Saving deal failed, please refresh and try again.",
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
          leadId: input.data.lead,
        },
      });

      return deal;
    }),
});
