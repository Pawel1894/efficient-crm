import { createServerSideHelpers } from "@trpc/react-query/server";
import { Box, Breadcrumbs, Button, IconButton, Stack, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { api } from "@/utils/api";
import type { GridColDef } from "@mui/x-data-grid";
import Link from "next/link";
import { Add, Delete, Edit, Visibility } from "@mui/icons-material";
import Insert from "./Insert";
import { useSystemStore } from "../_app";
import Head from "next/head";
import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { createTRPCContext } from "@/server/api/trpc";
import { appRouter } from "@/server/api/root";
import superjson from "superjson";
import Update from "./Update";
import type { Dictionary, Lead } from "@prisma/client";
import DeleteDialog from "@/components/DeleteDialog";

export type LeadData = Lead & {
  status: Dictionary | null;
};

export default function Page() {
  const [insertOpen, setInsertOpen] = useState(false);
  const [updateData, setUpdateData] = useState<LeadData>();
  const [updateOpen, setUpdateOpen] = useState(false);
  const { data: leads, isSuccess, refetch } = api.lead.leads.useQuery();
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deleteLead, isLoading: isDeleting } = api.lead.delete.useMutation({
    onSettled: async () => {
      await refetch();
    },
  });

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "action",
        headerName: "",
        filterable: false,
        hideable: false,
        sortable: false,
        minWidth: 125,
        renderCell: (params) => {
          const data = params.row as LeadData;

          return (
            <Stack direction={"row"} gap={"0.25rem"}>
              <Link href={`/lead/${data.id}`}>
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
              <IconButton
                onClick={() => {
                  setUpdateData(data);
                  setDeleteOpen(true);
                }}
                size="small"
                color="warning"
                title="Delete"
              >
                <Delete />
              </IconButton>
            </Stack>
          );
        },
      },
      { field: "firstName", headerName: "First Name", flex: 1, minWidth: 170 },
      { field: "lastName", headerName: "Last Name", flex: 1, minWidth: 170 },
      { field: "email", headerName: "Email", flex: 1, minWidth: 170 },
      {
        field: "status",
        valueGetter: (params) => {
          const data = params.row as LeadData;
          return data.status?.value ? data.status?.value : "";
        },
        headerName: "Status",
        flex: 1,
      },
      { field: "ownerFullname", headerName: "Owner", flex: 1 },
    ],
    []
  );

  useEffect(() => {
    setBreadcrumbs(
      <Breadcrumbs aria-label="breadcrumb">
        <Typography color="text.primary">Leads</Typography>
      </Breadcrumbs>
    );
  }, [setBreadcrumbs]);

  function handleDelete(confirmed: boolean, id?: string) {
    if (confirmed && id) {
      deleteLead(id);
    }

    setDeleteOpen(false);
    return;
  }

  return (
    <>
      <Head>
        <title>Leads</title>
      </Head>
      {updateData ? (
        <>
          <Update data={updateData} isOpen={updateOpen} setOpen={setUpdateOpen} />{" "}
          <DeleteDialog
            id={updateData.id}
            isDeleting={isDeleting}
            open={deleteOpen}
            handleClose={handleDelete}
          />
        </>
      ) : null}
      <Insert isOpen={insertOpen} setOpen={setInsertOpen} />
      <Stack gap={"1rem"}>
        <Box>
          <Button variant="outlined" onClick={() => setInsertOpen(true)}>
            create lead <Add />
          </Button>
        </Box>
        {isSuccess ? (
          <Box
            sx={{
              height: "calc(100vh - 200px)",
            }}
          >
            <DataGrid rowSelection={false} rows={leads} columns={columns} />
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

  await helpers.lead.leads.prefetch();

  return {
    props: {
      trpcState: helpers.dehydrate(),
    },
  };
};
