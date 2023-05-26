import { api } from "@/utils/api";
import type { Activity, Contact, Dictionary, Lead } from "@prisma/client";
import React, { useEffect, useMemo, useState } from "react";
import { useSystemStore } from "../_app";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Link from "next/link";
import { Add, Delete, Edit, Visibility } from "@mui/icons-material";
import { Box, Breadcrumbs, Button, IconButton, Stack, Typography } from "@mui/material";
import Head from "next/head";
import dayjs from "dayjs";
import Insert from "./Insert";
import Update from "./Update";
import DeleteDialog from "@/components/DeleteDialog";

export type ActivityData = Activity & {
  status: Dictionary | null;
  lead: Lead | null;
  contact: Contact | null;
};

export default function Page() {
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs);
  const [insertOpen, setInsertOpen] = useState(false);
  const [updateData, setUpdateData] = useState<ActivityData>();
  const [updateOpen, setUpdateOpen] = useState(false);
  const { data: activities, isSuccess, refetch } = api.activity.activities.useQuery();
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deleteActivity, isLoading: isDeleting } = api.activity.delete.useMutation({
    onSettled: async () => {
      await refetch();
    },
  });

  function handleDelete(confirmed: boolean, id?: string) {
    if (confirmed && id) {
      deleteActivity(id);
    }

    setDeleteOpen(false);
    return;
  }

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
          const data = params.row as ActivityData;

          return (
            <Stack direction={"row"} gap={"0.5rem"}>
              <Link href={`/activity/${data.id}`}>
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
      {
        field: "date",
        headerName: "Date",
        valueGetter: (params) => {
          const data = params.row as ActivityData;
          return dayjs(data.date?.toString()).format("DD/MM/YYYY HH:mm");
        },
        flex: 1,
        minWidth: 170,
      },
      {
        field: "status",
        valueGetter: (params) => {
          const data = params.row as ActivityData;
          return data.status?.value ? data.status?.value : "";
        },
        headerName: "Status",
        flex: 1,
      },
      { field: "ownerFullname", headerName: "Owner", flex: 1 },
      { field: "description", headerName: "Description", flex: 1 },
      {
        field: "lead",
        headerName: "Lead",
        valueGetter: (params) => {
          const data = params.row as ActivityData;
          return data.lead ? data.lead?.firstName + " " + data.lead?.lastName : "";
        },
      },
      {
        field: "title",
        headerName: "Title",
        flex: 1,
      },
      {
        field: "location",
        headerName: "Location",
        flex: 1,
      },
    ],
    []
  );

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
            create activity <Add />
          </Button>
        </Box>
        {isSuccess ? (
          <Box
            sx={{
              height: "calc(100vh - 200px)",
            }}
          >
            <DataGrid rowSelection={false} rows={activities} columns={columns} />
          </Box>
        ) : (
          <div></div>
        )}
      </Stack>
    </>
  );
}
