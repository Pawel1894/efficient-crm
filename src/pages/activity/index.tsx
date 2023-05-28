import type { Activity, Contact, Dictionary, Lead } from "@prisma/client";
import React, { useEffect } from "react";
import { useSystemStore } from "../_app";
import { Breadcrumbs, Typography } from "@mui/material";
import Head from "next/head";

import Grid from "./Grid";

export type ActivityData = Activity & {
  status: Dictionary | null;
  lead: Lead | null;
};

export default function Page() {
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs);

  useEffect(() => {
    setBreadcrumbs(
      <Breadcrumbs aria-label="breadcrumb">
        <Typography color="text.primary">Activities</Typography>
      </Breadcrumbs>
    );
  }, [setBreadcrumbs]);

  return (
    <>
      <Head>
        <title>Activities</title>
      </Head>
      <Grid shouldFetch={true} heightSubstract={200} />
    </>
  );
}
