import Glossary from "@/components/Glossary";
import TodayActivities from "@/components/TodayActivities";
import { useOrganization } from "@clerk/nextjs";
import { Box, Breadcrumbs, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import React, { useEffect } from "react";
import RecentLeads from "@/components/RecentLeads";
import { useSystemStore } from "../_app";
import Head from "next/head";

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
