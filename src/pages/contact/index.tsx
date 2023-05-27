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
import type { Contact, Dictionary } from "@prisma/client";
import DeleteDialog from "@/components/DeleteDialog";

export type ContactData = Contact & {
  type: Dictionary | null;
};

export default function Page() {
  const [insertOpen, setInsertOpen] = useState(false);
  const [updateData, setUpdateData] = useState<ContactData>();
  const [updateOpen, setUpdateOpen] = useState(false);
  const {
    data: contacts,
    isSuccess,
    refetch,
    isRefetching,
    error,
  } = api.contact.contacts.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deleteContact, isLoading: isDeleting } = api.contact.delete.useMutation({
    onSettled: async () => {
      await refetch();
    },
  });

  function handleDelete(confirmed: boolean, id?: string) {
    if (confirmed && id) {
      deleteContact(id);
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
          const data = params.row as ContactData;

          return (
            <Stack direction={"row"} gap={"0.25rem"}>
              <Link href={`/contact/${data.id}`}>
                <IconButton size="small" color="primary" title="View">
                  <Visibility />
                </IconButton>
              </Link>
              <IconButton
                onClick={() => {
                  setUpdateData(data);
                  setUpdateOpen(true);
                }}
                size="small"
                color="primary"
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
        field: "type",
        valueGetter: (params) => {
          const data = params.row as ContactData;
          return data.type?.value ? data.type?.value : "";
        },
        headerName: "Type",
        flex: 1,
      },
      { field: "ownerFullname", headerName: "Owner", flex: 1 },
      { field: "title", headerName: "Title", flex: 1 },
      { field: "phone", headerName: "Phone", flex: 1 },
      { field: "location", headerName: "Location", flex: 1 },
      { field: "teamName", headerName: "Team Name", flex: 1 },
    ],
    []
  );

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
            create contact <Add />
          </Button>
        </Box>
        <Box
          sx={{
            height: `calc(100vh - 200px)`,
          }}
        >
          {isRefetching ? (
            <Skeleton animation="wave" variant="rectangular" width="100%" height="100%" />
          ) : isSuccess ? (
            <DataGrid rowSelection={false} rows={contacts} columns={columns} />
          ) : (
            <Typography>{error?.message}</Typography>
          )}
        </Box>
      </Stack>
    </>
  );
}
