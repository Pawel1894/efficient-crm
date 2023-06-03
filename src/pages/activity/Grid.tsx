import Insert from "./Insert";
import Update from "./Update";
import DeleteDialog from "@/components/DeleteDialog";
import { Add, Delete, Edit, Visibility } from "@mui/icons-material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Box, Button, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import { api } from "@/utils/api";
import type { ActivityData } from ".";
import dayjs from "dayjs";
import Link from "next/link";

type Props = {
  leadId?: string;
  heightSubstract: number;
  shouldFetch: boolean;
};

export default function Grid({ heightSubstract, leadId, shouldFetch }: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deleteActivity, isLoading: isDeleting } = api.activity.delete.useMutation({
    onSettled: async () => {
      await refetch();
      refetchOnWindowFocus: false;
    },
  });
  const [insertOpen, setInsertOpen] = useState(false);
  const [updateData, setUpdateData] = useState<ActivityData>();
  const [updateOpen, setUpdateOpen] = useState(false);
  const {
    data: activities,
    isSuccess,
    refetch,
    isRefetching,
    isInitialLoading,
    error,
  } = api.activity.activities.useQuery(leadId, {
    enabled: shouldFetch,
  });
  const context = api.useContext();
  function handleDelete(confirmed: boolean, id?: string) {
    if (confirmed && id) {
      deleteActivity(id);
    }

    setDeleteOpen(false);
    return;
  }

  async function onUpdateSettled() {
    await context.activity.activities.invalidate();
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

  return (
    <>
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
      <Insert leadId={leadId} isOpen={insertOpen} setOpen={setInsertOpen} />
      <Stack gap={"1rem"}>
        <Box>
          <Button variant="outlined" onClick={() => setInsertOpen(true)}>
            create activity <Add />
          </Button>
        </Box>
        <Box
          sx={{
            height: `calc(100vh - ${heightSubstract}px)`,
          }}
          minHeight={400}
        >
          {isRefetching || isInitialLoading ? (
            <Skeleton animation="wave" variant="rectangular" width="100%" height="100%" />
          ) : isSuccess ? (
            <DataGrid rowSelection={false} rows={activities} columns={columns} />
          ) : (
            <Typography>{error?.message}</Typography>
          )}
        </Box>
      </Stack>
    </>
  );
}
