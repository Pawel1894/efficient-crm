import type { Deal, Dictionary, Lead } from "@prisma/client";
import React, { useEffect } from "react";
import { useSystemStore } from "../_app";
import { Breadcrumbs, Typography } from "@mui/material";
import Head from "next/head";
import Grid from "./Grid";

export type DealData = Deal & {
  stage: Dictionary | null;
  lead: Lead | null;
};

export default function Page() {
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs);

  useEffect(() => {
    setBreadcrumbs(
      <Breadcrumbs aria-label="breadcrumb">
        <Typography color="text.primary">Deals</Typography>
      </Breadcrumbs>
    );
  }, [setBreadcrumbs]);

  return (
    <>
      <Head>
        <title>Deals</title>
      </Head>
      <Grid shouldFetch={true} heightSubstract={200} />
    </>
  );
}
