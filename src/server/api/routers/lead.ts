import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getUser } from "@/utils/helper";
import { LeadSchema } from "@/utils/schema";
import { type OrganizationMembership } from "@clerk/nextjs/server";
import { TRPCError } from "@trpc/server";
import * as yup from "yup";
import { z } from "zod";
export const leadRouter = createTRPCRouter({
  recentlyUpdated: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.orgId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No team selected",
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
    if (!ctx.user.orgId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No team selected",
      });
    }

    const where: {
      team: string;
      AND?: {
        owner: string | null;
      };
    } = { team: ctx.user.orgId };

    if (ctx.user.role !== "admin") {
      where.AND = {
        owner: ctx.user.id,
      };
    }

    const results = await ctx.prisma.lead.findMany({
      where: where,
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        status: true,
        deals: true,
        activities: true,
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
        message: "No team selected",
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
        createdBy: userDetails.publicUserData?.identifier ?? "undefined",
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
          teamName: userDetails.organization.name,
          updatedBy: userDetails.publicUserData?.identifier ?? "undefined",
        },
      });

      return lead;
    }),
  delete: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    await ctx.prisma.lead.delete({
      where: {
        id: input,
      },
    });
  }),
  get: protectedProcedure.input(z.string().optional()).query(async ({ ctx, input }) => {
    if (!input) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Lead id is required",
      });
    }

    if (!ctx.user.orgId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "No team selected",
      });
    }

    const lead = await ctx.prisma.lead.findFirst({
      where: {
        id: input,
        AND: {
          team: ctx.user.orgId,
        },
      },
      include: {
        status: true,
      },
    });

    if (ctx.user.role !== "admin" && lead?.owner !== ctx.user.id) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: "You are not allowed to view this lead",
      });
    }

    if (lead === null) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "lead not found",
      });
    }

    return lead;
  }),
  assignStatus: protectedProcedure
    .input(
      z.object({
        status: z.object({
          id: z.string(),
          label: z.string(),
          orgId: z.string(),
          type: z.string(),
          value: z.string(),
        }),
        leadId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.lead.update({
        where: {
          id: input.leadId,
        },
        data: {
          dictionaryId: input.status.id,
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
        leadId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.lead.update({
        where: {
          id: input.leadId,
        },
        data: {
          owner: input.owner.id,
          ownerFullname: input.owner.fullname,
        },
      });
    }),
});
