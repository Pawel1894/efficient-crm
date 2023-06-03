import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";

export const analyticsRouter = createTRPCRouter({
  groupedByStatus: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.orgId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot find team",
      });
    }

    // workaround -> not supported by prisma to group by relationship
    const leads = await ctx.prisma.lead.groupBy({
      by: ["dictionaryId"],
      where: {
        team: ctx.user.orgId,
      },
      _count: {
        dictionaryId: true,
        _all: true,
      },
    });

    const statuses = await ctx.prisma.dictionary.findMany({
      where: {
        type: "LEAD_STATUS",
      },
    });

    const result = leads.map((lead) => {
      return {
        Name: lead.dictionaryId ? statuses.find((stat) => stat.id === lead.dictionaryId)?.label : "none",
        statuses: lead._count._all,
      };
    });

    return result;
  }),
  valuesByStage: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.orgId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot find team",
      });
    }

    // workaround -> not supported by prisma to group by relationship
    const deals = await ctx.prisma.deal.groupBy({
      by: ["dictionaryId"],
      where: {
        team: ctx.user.orgId,
      },
      _sum: {
        forecast: true,
        value: true,
      },
    });

    const stages = await ctx.prisma.dictionary.findMany({
      where: {
        type: "DEAL_STAGE",
      },
    });

    const result = deals.map((deal) => {
      return {
        Stage: deal.dictionaryId ? stages.find((stage) => stage.id === deal.dictionaryId)?.label : "none",
        "Forecast value": deal._sum.forecast,
        "Final value": deal._sum.value,
      };
    });

    return result;
  }),
  valuesThisYear: protectedProcedure.query(async ({ ctx }) => {
    if (!ctx.user.orgId) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Cannot find team",
      });
    }

    const result: Array<{
      month: string;
      sum: number;
      forecast: number;
      totalDeals: number;
    }> = await ctx.prisma
      .$queryRaw`SELECT MONTHNAME(updatedAt) as month, SUM(value) as sum, SUM(forecast) as forecast, count(*) AS totalDeals
      FROM \`efficient-crm\`.deal
      WHERE YEAR(updatedAt) = year(curdate()) and team = ${ctx.user.orgId}
      GROUP BY month order by updatedAt`;

    const result2 = result.map((r) => {
      return {
        Deals: String(r.totalDeals),
        Month: r.month,
        "Final value": r.sum,
        "Forecast value": r.forecast,
      };
    });

    return result2;
  }),
});
