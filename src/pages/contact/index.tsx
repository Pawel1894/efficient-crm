import Layout from "@/components/Layout";
import { Breadcrumbs, Typography } from "@mui/material";
import React from "react";

export default function Page() {
  return (
    <Layout
      breadcrumbs={
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="text.primary">Contacts</Typography>
        </Breadcrumbs>
      }
    >
      <div>span</div>
    </Layout>
  );
}
