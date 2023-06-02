import { Box, Breadcrumbs, Button, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { api } from "@/utils/api";
import type { GridColDef } from "@mui/x-data-grid";
import Link from "next/link";
import { Add, Delete, Edit, Visibility } from "@mui/icons-material";
import Insert from "./Insert";
import { useSystemStore } from "../_app";
import Head from "next/head";
import Update from "./Update";
import type { Activity, Deal, Dictionary, Lead } from "@prisma/client";
import DeleteDialog from "@/components/DeleteDialog";

export type LeadData = Lead & {
  status: Dictionary | null;
  activities: Activity[] | null;
  deals: Deal[] | null;
};

export default function Page() {
  const [insertOpen, setInsertOpen] = useState(false);
  const [updateData, setUpdateData] = useState<LeadData>();
  const [updateOpen, setUpdateOpen] = useState(false);
  const {
    data: leads,
    isSuccess,
    refetch,
    isRefetching,
    error,
  } = api.lead.leads.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deleteLead, isLoading: isDeleting } = api.lead.delete.useMutation({
    onSettled: async () => {
      await refetch();
    },
  });
  const context = api.useContext();

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
        minWidth: 90,
        field: "status",
        valueGetter: (params) => {
          const data = params.row as LeadData;
          return data.status?.value ? data.status?.value : "";
        },
        headerName: "Status",
        flex: 1,
      },
      { minWidth: 140, field: "ownerFullname", headerName: "Owner", flex: 1 },
      {
        minWidth: 90,
        field: "activities",
        headerName: "Activities No.",
        valueGetter: (params) => {
          const data = params.row as LeadData;
          return data.activities?.length ?? 0;
        },
        flex: 1,
      },
      {
        minWidth: 90,
        field: "deals",
        headerName: "Deals No.",
        valueGetter: (params) => {
          const data = params.row as LeadData;
          return data.deals?.length ?? 0;
        },
        flex: 1,
      },
      {
        minWidth: 140,
        field: "location",
        headerName: "Location",
        valueGetter: (params) => {
          const data = params.row as LeadData;
          return data.location;
        },
        flex: 1,
      },
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

  async function onUpdateSettled() {
    await context.lead.leads.invalidate();
  }

  return (
    <>
      <Head>
        <title>Leads</title>
      </Head>
      {updateData ? (
        <>
          <Update
            onSettledHandler={onUpdateSettled}
            data={updateData}
            isOpen={updateOpen}
            setOpen={setUpdateOpen}
          />{" "}
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
        <Box
          sx={{
            height: `calc(100vh - 200px)`,
          }}
          minHeight={400}
        >
          {isRefetching ? (
            <Skeleton animation="wave" variant="rectangular" width="100%" height="100%" />
          ) : isSuccess ? (
            <DataGrid rowSelection={false} rows={leads} columns={columns} />
          ) : (
            <Typography>{error?.message}</Typography>
          )}
        </Box>
      </Stack>
    </>
  );
}
