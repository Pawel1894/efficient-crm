import superjson from "superjson";
import Glossary from "@/components/Glossary";
import IncomingActivities from "@/components/IncomingActivities";
import { useOrganization } from "@clerk/nextjs";
import { Box, Breadcrumbs, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import React, { useEffect } from "react";
import RecentContacts from "@/components/RecentContacts";
import RecentLeads from "@/components/RecentLeads";
import { api } from "@/utils/api";
import { useSystemStore } from "../_app";
import Head from "next/head";
import { getAuth } from "@clerk/nextjs/server";
import { NextApiRequest, NextApiResponse } from "next";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";

export default function Page() {
  const { organization } = useOrganization();
  const { mutate } = api.system.coldStart.useMutation();
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
      <button
        onClick={() =>
          mutate({
            id: "org_2Pm3RfjjE1MNzv6ReXt9Vf6Mjwy",
            name: "Paweł P's team",
            userName: "Paweł P",
          })
        }
      >
        test
      </button>
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
              <IncomingActivities />
            </Paper>
          </Grid>
          <Grid xs={12} md={6}>
            <RecentContacts />
          </Grid>
          <Grid xs={12} md={6}>
            <RecentLeads />
          </Grid>
        </Grid>
      </Box>
    </>
  );
}

export const getServerSideProps = async ({ req, res }: { req: NextApiRequest; res: NextApiResponse }) => {
  const session = getAuth(req);
  if (!session?.orgId) {
    return {};
  }

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createTRPCContext({
      req: req,
      res: res,
    }),
    transformer: superjson,
  });

  await helpers.lead.recentlyUpdated.prefetch(session.orgId);
  await helpers.contact.recentlyUpdated.prefetch(session.orgId);
  await helpers.activity.incoming.prefetch(session.orgId);

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
};
