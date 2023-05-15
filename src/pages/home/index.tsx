import Glossary from "@/components/Glossary";
import IncomingActivities from "@/components/IncomingActivities";
import Layout from "@/components/Layout";
import RecentlyUpdated from "@/components/RecentlyUpdated";
import { useOrganization } from "@clerk/nextjs";
import { Box, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import Breadcrumbs from "@mui/material/Breadcrumbs";
import React from "react";
import { api } from "@/utils/api";
import RecentContacts from "@/components/RecentContacts";
import RecentLeads from "@/components/RecentLeads";

export default function Page() {
  const { organization } = useOrganization();

  return (
    <Layout
      breadcrumbs={
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="text.primary">Homepage</Typography>
        </Breadcrumbs>
      }
    >
      <>
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
              <RecentContacts />
            </Grid>
            <Grid xs={12} md={6}>
              <RecentLeads />
            </Grid>
            <Grid xs={12} md={6}>
              <Paper>
                <IncomingActivities />
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </>
    </Layout>
  );
}
