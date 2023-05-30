import superjson from "superjson";
import Glossary from "@/components/Glossary";
import TodayActivities from "@/components/TodayActivities";
import { useOrganization } from "@clerk/nextjs";
import { Box, Breadcrumbs, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import React, { useEffect } from "react";
import RecentLeads from "@/components/RecentLeads";
import { api } from "@/utils/api";
import { useSystemStore } from "../_app";
import Head from "next/head";
import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

export default function Page() {
  const { organization } = useOrganization();
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs);

  useEffect(() => {
    setBreadcrumbs(
      <Breadcrumbs aria-label="breadcrumb">
        <Typography color="text.primary">Homepage</Typography>
      </Breadcrumbs>
    );
  }, [setBreadcrumbs]);

  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Typography component={"h1"} variant="h4" color={"primary.main"}>
        {organization?.name}
      </Typography>
      <Box mt={4}>
        <Grid container spacing={2}>
          <Grid xs={12} md={6}>
            <Paper>
              <Glossary />
            </Paper>
          </Grid>
          <Grid xs={12} md={6}>
            <Paper>
              <TodayActivities />
            </Paper>
          </Grid>
          <Grid xs={12}>
            <RecentLeads />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export const getServerSideProps = async ({ req, res }: { req: NextApiRequest; res: NextApiResponse }) => {
  const session = getAuth(req);
  if (!session?.userId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createTRPCContext({
      req: req,
      res: res,
    }),
    transformer: superjson,
  });

  await helpers.lead.recentlyUpdated.prefetch();
  await helpers.activity.today.prefetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
};
