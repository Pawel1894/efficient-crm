import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { clerkClient } from "@clerk/nextjs";
import { TRPCError } from "@trpc/server";
import dayjs from "dayjs";
import { z } from "zod";

export const systemRouter = createTRPCRouter({
  coldStart: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        userName: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!ctx.user.id) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "User id not found",
        });
      }

      await ctx.prisma.dictionary.createMany({
        data: [
          {
            type: "ACTIVITY_STATUS",
            label: "open",
            value: "open",
            orgId: input.id,
          },
          {
            type: "ACTIVITY_STATUS",
            label: "active",
            value: "active",
            orgId: input.id,
          },
          {
            type: "ACTIVITY_STATUS",
            label: "closed",
            value: "closed",
            orgId: input.id,
          },
          {
            type: "DEAL_STAGE",
            label: "open",
            value: "open",
            orgId: input.id,
          },
          {
            type: "DEAL_STAGE",
            label: "active",
            value: "active",
            orgId: input.id,
          },
          {
            type: "DEAL_STAGE",
            label: "closed",
            value: "closed",
            orgId: input.id,
          },
          {
            type: "LEAD_STATUS",
            label: "open",
            value: "open",
            orgId: input.id,
          },
          {
            type: "LEAD_STATUS",
            label: "active",
            value: "active",
            orgId: input.id,
          },
          {
            type: "LEAD_STATUS",
            label: "closed",
            value: "closed",
            orgId: input.id,
          },
        ],
      });

      // create lead
      const lead = await ctx.prisma.lead.create({
        data: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          createdBy: input.userName,
          updatedBy: input.userName,
          owner: ctx.user.id,
          ownerFullname: input.userName,
          teamName: input.name,
          team: input.id,
          comment: "simple comment",
          company: "example company",
        },
      });

      // create deals
      await ctx.prisma.deal.create({
        data: {
          comment: "Test comment",
          value: 0,
          createdBy: ctx.user.id,
          forecast: 80000,
          owner: ctx.user.id,
          ownerFullname: input.userName,
          updatedBy: ctx.user.id,
          team: input.id,
          teamName: input.name,
          lead: {
            connect: {
              id: lead.id,
            },
          },
        },
      });

      await ctx.prisma.activity.create({
        data: {
          date: dayjs().toDate(),
          owner: ctx.user.id,
          ownerFullname: input.userName,
          createdBy: input.userName,
          updatedBy: input.userName,
          team: input.id,
          teamName: input.name,
          lead: {
            connect: {
              id: lead.id,
            },
          },
          title: "Send offert",
          description: "Send offert via email",
        },
      });

      await ctx.prisma.activity.create({
        data: {
          date: new Date(),
          owner: ctx.user.id,
          ownerFullname: input.userName,
          team: input.id,
          teamName: input.name,
          createdBy: input.userName,
          updatedBy: input.userName,
          lead: {
            connect: {
              id: lead.id,
            },
          },
          title: "Meeting",
          description: "F2F meeting at lead's office",
          location: "Wrocław - Sky Tower, ul. Powstańców śląskich 95/45, 53-332",
        },
      });

      const settings = await ctx.prisma.userControl.findFirst({
        where: {
          userId: ctx.user.id,
        },
      });

      return settings;
    }),
  getMembershipList: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.id || !ctx.user.orgId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "User id not found",
      });
    }

    return await clerkClient.organizations.getOrganizationMembershipList({ organizationId: ctx.user.orgId });
  }),
});
