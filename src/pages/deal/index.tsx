import { createServerSideHelpers } from "@trpc/react-query/server";
import type { NextApiRequest, NextApiResponse } from "next";
import { api } from "@/utils/api";
import { Deal, Dictionary, Lead } from "@prisma/client";
import React, { useEffect, useMemo, useState } from "react";
import { useSystemStore } from "../_app";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Breadcrumbs, Button, IconButton, Link, Stack, Typography } from "@mui/material";
import { Add, Edit, Visibility } from "@mui/icons-material";
import Head from "next/head";
import Insert from "./Insert";
import superjson from "superjson";
import { getAuth } from "@clerk/nextjs/server";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import Update from "./Update";

export type DealData = Deal & {
  stage: Dictionary | null;
  lead: Lead | null;
};

export default function Page() {
  const [insertOpen, setInsertOpen] = useState(false);
  const [updateData, setUpdateData] = useState<DealData>();
  const [updateOpen, setUpdateOpen] = useState(false);
  const { data: deals, isSuccess } = api.deal.deals.useQuery();
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "action",
        headerName: "",
        filterable: false,
        hideable: false,
        sortable: false,
        renderCell: (params) => {
          const data = params.row as DealData;

          return (
            <Stack direction={"row"} gap={"0.5rem"}>
              <Link href={`/deal/${data.id}`}>
                <IconButton size="small" sx={{ color: "primary.main" }} title="View">
                  <Visibility />
                </IconButton>
              </Link>
              <IconButton
                onClick={() => {
                  setUpdateData(data);
                  setUpdateOpen(true);
                }}
                size="small"
                sx={{ color: "primary.main" }}
                title="Edit"
              >
                <Edit />
              </IconButton>
            </Stack>
          );
        },
      },
      { field: "forecast", headerName: "Forecast", flex: 1, minWidth: 170 },
      { field: "value", headerName: "Value", flex: 1, minWidth: 170 },
      {
        field: "status",
        valueGetter: (params) => {
          const data = params.row as DealData;
          return data.stage?.value ? data.stage?.value : "";
        },
        headerName: "Stage",
        flex: 1,
      },
      { field: "ownerFullname", headerName: "Owner", flex: 1 },
      { field: "comment", headerName: "Comment", flex: 1 },
      {
        field: "lead",
        headerName: "Lead",
        valueGetter: (params) => {
          const data = params.row as DealData;
          return data.lead ? data.lead?.firstName + " " + data.lead?.lastName : "";
        },
        flex: 1,
      },
    ],
    []
  );

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
      {updateData ? <Update data={updateData} isOpen={updateOpen} setOpen={setUpdateOpen} /> : null}
      <Insert isOpen={insertOpen} setOpen={setInsertOpen} />
      <Stack gap={"1rem"}>
        <Box>
          <Button variant="outlined" onClick={() => setInsertOpen(true)}>
            create deal <Add />
          </Button>
        </Box>
        {isSuccess ? (
          <Box
            sx={{
              height: "calc(100vh - 200px)",
            }}
          >
            <DataGrid rowSelection={false} rows={deals} columns={columns} />
          </Box>
        ) : (
          <div></div>
        )}
      </Stack>
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
