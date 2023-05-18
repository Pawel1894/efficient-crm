import Glossary from "@/components/Glossary";
import IncomingActivities from "@/components/IncomingActivities";
import Layout from "@/components/Layout";
import { useOrganization } from "@clerk/nextjs";
import { Box, Paper, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import React from "react";
import RecentContacts from "@/components/RecentContacts";
import RecentLeads from "@/components/RecentLeads";
import { api } from "@/utils/api";

export default function Page() {
  const { organization } = useOrganization();
  const { mutate } = api.system.coldStart.useMutation();
  return (
    <Layout
      title="Efficient CRM - Homepage"
      breadcrumbs={
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="text.primary">Homepage</Typography>
        </Breadcrumbs>
      }
    >
      <>
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
    </Layout>
  );
}
