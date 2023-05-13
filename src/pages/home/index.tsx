import Layout from "@/components/Layout";
import { useOrganization } from "@clerk/nextjs";
import { Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import React from "react";

export default function Page() {
  const { organization } = useOrganization();

  return (
    <Layout
      breadcrumbs={
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="text.primary">{organization?.name}</Typography>
          <Typography color="text.primary">Homepage</Typography>
        </Breadcrumbs>
      }
    >
      <div>{organization?.name}</div>
    </Layout>
  );
}
