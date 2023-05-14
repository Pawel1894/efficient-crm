import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";

export const systemRouter = createTRPCRouter({
  coldStart: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
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
          type: "CONTACT_TYPE",
          label: "client",
          value: "client",
          orgId: input,
        },
        {
          type: "CONTACT_TYPE",
          label: "company",
          value: "company",
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

    // create contact
    const contact = await ctx.prisma.contact.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        type: "client",
        createdBy: ctx.user.id,
        updatedBy: ctx.user.id,
        team: input,
      },
    });

    // create lead
    const lead = await ctx.prisma.lead.create({
      data: {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        createdBy: ctx.user.id,
        updatedBy: ctx.user.id,
        owner: ctx.user.id,
        status: "open",
        team: input,
        comment: "simple comment",
        company: "example company",
      },
    });

    // create deals
    const deal = await ctx.prisma.deal.create({
      data: {
        closeProbability: 0.8,
        createdBy: ctx.user.id,
        forecast: 80000,
        owner: ctx.user.id,
        stage: "open",
        updatedBy: ctx.user.id,
        lead: {
          connect: {
            id: lead.id,
          },
        },
      },
    });

    await ctx.prisma.activity.create({
      data: {
        date: new Date("2023-05-16T11:25").toISOString(),
        owner: ctx.user.id,
        status: "open",
        contact: {
          connect: {
            id: contact.id,
          },
        },
        title: "Send offert",
        description: "Send offert via email",
      },
    });

    await ctx.prisma.activity.create({
      data: {
        date: new Date("2023-05-16T11:25").toISOString(),
        owner: ctx.user.id,
        status: "open",
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
});
