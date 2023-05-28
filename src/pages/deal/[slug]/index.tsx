import { useSystemStore } from "@/pages/_app";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { api } from "@/utils/api";
import { getAuth } from "@clerk/nextjs/server";
import { Breadcrumbs, Typography, useMediaQuery } from "@mui/material";
import { Deal } from "@prisma/client";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { TRPCError } from "@trpc/server";
import type { InferGetServerSidePropsType, NextApiRequest, NextApiResponse } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import superjson from "superjson";
import { DealData } from "..";
import Head from "next/head";

export default function Page({ error, initData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const {
    data: deal,
    isError,
    error: fetchError,
  } = api.deal.get.useQuery(router.query.slug as string, {
    initialData: initData ? (JSON.parse(initData) as Deal) : [],
  });
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateData, setUpdateData] = useState<DealData>();
  const [updateOpen, setUpdateOpen] = useState(false);
  const { mutate: deleteDeal, isLoading: isDeleting } = api.deal.delete.useMutation();

  useEffect(() => {
    setBreadcrumbs(
      <Breadcrumbs aria-label="breadcrumb">
        <Link style={{ textDecoration: "unset" }} href={"/deal"}>
          <Typography color={"text.primary"} component="span" variant="body2">
            Deals
          </Typography>
        </Link>
        <Typography color="text.primary">Deal #{deal?.id}</Typography>
      </Breadcrumbs>
    );
  }, [setBreadcrumbs, deal]);

  async function handleDelete(confirmed: boolean, id?: string) {
    if (confirmed && id) {
      deleteDeal(id);
      await router.push("/deal");
    }

    setDeleteOpen(false);
    return;
  }

  return (
    <>
      <Head>
        <title>Deal</title>
      </Head>
    </>
  );
}

export const getServerSideProps = async ({
  params,
  req,
  res,
}: {
  params: { slug: string };
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
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

  try {
    const deal = await helpers.deal.get.fetch(params.slug);

    return {
      props: {
        initData: JSON.stringify(deal),
        error: null,
      },
    };
  } catch (error) {
    let message = "Unknown Error!, please contact admin";
    if (error instanceof TRPCError) {
      message = error.message;
    }

    return {
      props: {
        initData: null,
        error: message,
      },
    };
  }
};
