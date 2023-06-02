import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { clerkClient } from "@clerk/nextjs";
import { organizations } from "@clerk/nextjs/api";

export const teamRouter = createTRPCRouter({
  removeMember: protectedProcedure.input(z.string()).mutation(async ({ ctx, input }) => {
    const org = ctx.user.orgId;

    if (!org || ctx.user.role !== "admin") {
      return "";
    }

    const test = await organizations.getOrganizationMembershipList({ organizationId: org });
    test.forEach((t) => {
      console.log(t);
    });
  }),
});
