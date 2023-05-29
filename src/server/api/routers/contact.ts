import { ContactSchema } from "@/utils/schema";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { getUser } from "@/utils/helper";
import { z } from "zod";
import { type OrganizationMembership } from "@clerk/nextjs/api";
import { TRPCError } from "@trpc/server";
import * as yup from "yup";
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
        createdBy: userDetails.publicUserData?.identifier ?? "undefined",
        team: ctx.user.orgId,
        teamName: userDetails.organization.name,
      },
    });

    return contact;
  }),
  update: protectedProcedure
    .input(
      yup.object({
        id: yup.string(),
        data: ContactSchema,
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
          message: "Saving contact failed, please refresh and try again.",
        });
      }

      const { owner: _, type: __, ...params } = input.data;

      const contact = await ctx.prisma.contact.update({
        where: {
          id: input.id,
        },
        data: {
          ...params,
          owner: input.data.owner?.userId,
          ownerFullname: input.data.owner?.identifier,
          dictionaryId: input.data.type,
          teamName: userDetails.organization.name,
          updatedBy: userDetails.publicUserData?.identifier ?? "undefined",
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
    } = { team: ctx.user.orgId };

    if (ctx.user.role !== "admin") {
      where.AND = {
        owner: ctx.user.id,
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
  get: protectedProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const contact = await ctx.prisma.contact.findFirst({
      where: {
        id: input,
      },
      include: {
        type: true,
      },
    });

    if (contact === null) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "Contact not found",
      });
    }

    return contact;
  }),
  delete: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    await ctx.prisma.contact.delete({
      where: {
        id: input,
      },
    });
  }),
  assignType: protectedProcedure
    .input(
      z.object({
        type: z.object({
          id: z.string(),
          label: z.string(),
          orgId: z.string(),
          type: z.string(),
          value: z.string(),
        }),
        contactId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.contact.update({
        where: {
          id: input.contactId,
        },
        data: {
          dictionaryId: input.type.id,
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
        contactId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.contact.update({
        where: {
          id: input.contactId,
        },
        data: {
          owner: input.owner.id,
          ownerFullname: input.owner.fullname,
        },
      });
    }),
});
