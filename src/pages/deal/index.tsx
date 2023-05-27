import { createServerSideHelpers } from "@trpc/react-query/server";
import type { NextApiRequest, NextApiResponse } from "next";
import type { Deal, Dictionary, Lead } from "@prisma/client";
import React, { useEffect } from "react";
import { useSystemStore } from "../_app";
import { Breadcrumbs, Typography } from "@mui/material";
import Head from "next/head";
import superjson from "superjson";
import { getAuth } from "@clerk/nextjs/server";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
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
      <Grid heightSubstract={200} />
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

  await helpers.deal.deals.prefetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
};
