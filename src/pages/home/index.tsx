import Layout from "@/components/Layout";
import { Typography } from "@mui/material";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import Link from "@mui/material/Link";
import React from "react";

export default function Page() {
  return (
    <Layout
      breadcrumbs={
        <Breadcrumbs aria-label="breadcrumb">
          <Typography color="text.primary">Homepage</Typography>
        </Breadcrumbs>
      }
    >
      <div>test</div>
    </Layout>
  );
}
