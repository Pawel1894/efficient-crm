import { ContactSchema } from "@/utils/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getUser } from "@/utils/helper";
import { z } from "zod";
import { type OrganizationMembership } from "@clerk/nextjs/api";
import { TRPCError } from "@trpc/server";

export const contactRouter = createTRPCRouter({
  create: protectedProcedure.input(ContactSchema).mutation(async ({ ctx, input }) => {
    let userDetails: OrganizationMembership | undefined;

    if (ctx.user.orgId && ctx.user.id) {
      userDetails = await getUser(ctx.user.orgId, ctx.user.id);
    }

    if (!userDetails || !ctx.user.orgId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Saving contact failed, please refresh and try again.",
      });
    }

    const { owner: _, type: __, ...params } = input;

    const contact = await ctx.prisma.contact.create({
      data: {
        ...params,
        owner: input.owner?.userId,
        ownerFullname: input.owner?.identifier,
        dictionaryId: input.type,
        updatedBy: userDetails.publicUserData?.identifier ?? "undefined",
        team: ctx.user.orgId,
        teamName: userDetails.organization.name,
      },
    });

    return contact;
  }),
  recentlyUpdated: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.orgId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot fetch contacts",
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
    let where;

    if (!ctx.user.orgId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot fetch contacts",
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

    const results = await ctx.prisma.contact.findMany({
      where: where,
      orderBy: {
        updatedAt: "desc",
      },
      include: {
        type: true,
      },
    });

    return results;
  }),
});
