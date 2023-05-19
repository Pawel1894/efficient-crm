import { createServerSideHelpers } from "@trpc/react-query/server";
import { Box, Breadcrumbs, Button, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { api } from "@/utils/api";
import type { GridColDef } from "@mui/x-data-grid";
import Link from "next/link";
import { Add, Edit, Visibility } from "@mui/icons-material";
import Insert from "./Insert";
import { useSystemStore } from "../_app";
import Head from "next/head";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { createTRPCContext } from "@/server/api/trpc";
import { appRouter } from "@/server/api/root";
import superjson from "superjson";
const columns: GridColDef[] = [
  {
    field: "action",
    headerName: "",
    filterable: false,
    hideable: false,
    sortable: false,
    renderCell: (params) => {
      return (
        <Stack direction={"row"} gap={"0.5rem"}>
          <Link href={`/contact/${params.id}`}>
            <IconButton size="small" sx={{ color: "primary.main" }} title="View">
              <Visibility />
            </IconButton>
          </Link>
          <IconButton size="small" sx={{ color: "primary.main" }} title="Edit">
            <Edit />
          </IconButton>
        </Stack>
      );
    },
  },
  { field: "firstName", headerName: "First Name", flex: 1, minWidth: 170 },
  { field: "lastName", headerName: "Last Name", flex: 1, minWidth: 170 },
  { field: "email", headerName: "Email", flex: 1, minWidth: 170 },
  {
    field: "type",
    valueGetter: (params) => {
      return params.row.type?.value ?? "";
    },
    headerName: "Type",
    flex: 1,
  },
  { field: "ownerFullname", headerName: "Owner", flex: 1 },
];

export default function Page() {
  const [insertOpen, setInsertOpen] = useState(false);
  const { data: contacts, isSuccess } = api.contact.contacts.useQuery();
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs);

  useEffect(() => {
    setBreadcrumbs(
      <Breadcrumbs aria-label="breadcrumb">
        <Typography color="text.primary">Contacts</Typography>
      </Breadcrumbs>
    );
  }, [setBreadcrumbs]);

  return (
    <>
      <Head>
        <title>Contacts</title>
      </Head>
      <Insert insertOpen={insertOpen} setInsertOpen={setInsertOpen} />
      <Stack gap={"1rem"}>
        <Box>
          <Button variant="outlined" onClick={() => setInsertOpen(true)}>
            create contact <Add />
          </Button>
        </Box>
        {isSuccess ? (
          <Box
            sx={{
              height: "calc(100vh - 200px)",
            }}
          >
            <DataGrid rowSelection={false} rows={contacts} columns={columns} />
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

  await helpers.contact.contacts.prefetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
};
