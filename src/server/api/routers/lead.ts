import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getUser } from "@/utils/helper";
import { LeadSchema } from "@/utils/schema";
import { type OrganizationMembership } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import * as yup from "yup";
export const leadRouter = createTRPCRouter({
  recentlyUpdated: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.orgId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot fetch leads",
      });
    }

    const where: {
      team: string;
      AND?: {
        owner: string | null;
      };
    } = {
      team: ctx.user.orgId,
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
  leads: protectedProcedure.query(async ({ ctx }) => {
    let where;

    if (!ctx.user.orgId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot fetch leads",
      });
    }

    if (ctx.user.role !== "admin") {
      where = {
        owner: ctx.user.id,
        AND: {
          team: ctx.user.orgId,
        },
      };
    } else {
      where = {
        team: ctx.user.orgId,
      };
    }

    const results = await ctx.prisma.lead.findMany({
      where: where,
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        status: true,
      },
    });

    return results;
  }),
  create: protectedProcedure.input(LeadSchema).mutation(async ({ ctx, input }) => {
    let userDetails: OrganizationMembership | undefined;

    if (ctx.user.orgId && ctx.user.id) {
      userDetails = await getUser(ctx.user.orgId, ctx.user.id);
    }

    if (!userDetails || !ctx.user.orgId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Saving lead failed, please refresh and try again.",
      });
    }

    const { owner: _, status: __, ...params } = input;

    const lead = await ctx.prisma.lead.create({
      data: {
        ...params,
        owner: input.owner?.userId,
        ownerFullname: input.owner?.identifier,
        dictionaryId: input.status,
        updatedBy: userDetails.publicUserData?.identifier ?? "undefined",
        team: ctx.user.orgId,
        teamName: userDetails.organization.name,
      },
    });

    return lead;
  }),
  update: protectedProcedure
    .input(
      yup.object({
        id: yup.string(),
        data: LeadSchema,
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
          message: "Saving lead failed, please refresh and try again.",
        });
      }

      const { owner: _, status: __, ...params } = input.data;

      const lead = await ctx.prisma.lead.update({
        where: {
          id: input.id,
        },
        data: {
          ...params,
          owner: input.data.owner?.userId,
          ownerFullname: input.data.owner?.identifier,
          dictionaryId: input.data.status,
          updatedBy: userDetails.publicUserData?.identifier ?? "undefined",
        },
      });

      return lead;
    }),
});
