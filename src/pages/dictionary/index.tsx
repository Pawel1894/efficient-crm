import { Box, Breadcrumbs, Button, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { api } from "@/utils/api";
import type { GridColDef } from "@mui/x-data-grid";
import { Add, Delete, Edit } from "@mui/icons-material";
import { useSystemStore } from "../_app";
import Head from "next/head";
import type { Dictionary } from "@prisma/client";
import DeleteDialog from "@/components/DeleteDialog";
import Insert from "./Insert";
import Update from "./Update";
import { useOrganization } from "@clerk/nextjs";

export default function Page() {
  const { membership } = useOrganization();
  const [insertOpen, setInsertOpen] = useState(false);
  const [updateData, setUpdateData] = useState<Dictionary>();
  const [updateOpen, setUpdateOpen] = useState(false);
  const {
    data: dictionaries,
    isSuccess,
    refetch,
    isRefetching,
    isInitialLoading,
    error,
  } = api.dictionary.dictionaries.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deleteDictionary, isLoading: isDeleting } = api.dictionary.delete.useMutation({
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
        minWidth: 0,
        renderCell: (params) => {
          const data = params.row as Dictionary;

          return (
            <Stack direction={"row"} gap={"0.25rem"}>
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
              {membership?.role === "admin" && (
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
              )}
            </Stack>
          );
        },
      },
      { field: "label", headerName: "Label", flex: 1, minWidth: 170 },
      { field: "value", headerName: "Value", flex: 1, minWidth: 170 },
      { field: "type", headerName: "Type", flex: 1, minWidth: 170 },
    ],
    []
  );

  useEffect(() => {
    setBreadcrumbs(
      <Breadcrumbs aria-label="breadcrumb">
        <Typography color="text.primary">Dictionaries</Typography>
      </Breadcrumbs>
    );
  }, [setBreadcrumbs]);

  function handleDelete(confirmed: boolean, id?: string) {
    if (confirmed && id) {
      deleteDictionary(id);
    }

    setDeleteOpen(false);
    return;
  }

  async function onUpdateSettled() {
    await context.dictionary.dictionaries.invalidate();
  }

  return (
    <>
      <Head>
        <title>Dictionaries</title>
      </Head>
      {updateData ? (
        <>
          <Update
            onSettledHandler={onUpdateSettled}
            data={updateData}
            isOpen={updateOpen}
            setOpen={setUpdateOpen}
          />
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
        {membership?.role === "admin" && (
          <Box>
            <Button variant="outlined" onClick={() => setInsertOpen(true)}>
              create dictionary <Add />
            </Button>
          </Box>
        )}
        <Box
          sx={{
            height: `calc(100vh - 200px)`,
          }}
          minHeight={400}
        >
          {isRefetching || isInitialLoading ? (
            <Skeleton animation="wave" variant="rectangular" width="100%" height="100%" />
          ) : isSuccess ? (
            <DataGrid
              initialState={{
                columns: {
                  columnVisibilityModel: {
                    action: membership?.role !== "admin" ? false : true,
                  },
                },
              }}
              rowSelection={false}
              rows={dictionaries}
              columns={columns}
            />
          ) : (
            <Typography>{error?.message}</Typography>
          )}
        </Box>
      </Stack>
    </>
  );
}
