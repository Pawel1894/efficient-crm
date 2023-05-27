import Insert from "./Insert";
import Update from "./Update";
import DeleteDialog from "@/components/DeleteDialog";
import { Add, Delete, Edit, Visibility } from "@mui/icons-material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import { Box, Button, IconButton, Link, Stack, Typography } from "@mui/material";
import React, { useMemo, useState } from "react";
import { api } from "@/utils/api";
import type { DealData } from ".";
type Props = {
  leadId?: string;
  heightSubstract: number;
};

export default function Grid({ leadId, heightSubstract }: Props) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const { mutate: deleteDeal, isLoading: isDeleting } = api.deal.delete.useMutation({
    onSettled: async () => {
      await refetch();
    },
  });
  const [insertOpen, setInsertOpen] = useState(false);
  const [updateData, setUpdateData] = useState<DealData>();
  const [updateOpen, setUpdateOpen] = useState(false);
  const { data: deals, isSuccess, refetch } = api.deal.deals.useQuery(leadId);

  function handleDelete(confirmed: boolean, id?: string) {
    if (confirmed && id) {
      deleteDeal(id);
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

  return (
    <>
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
      <Insert leadId={leadId} isOpen={insertOpen} setOpen={setInsertOpen} />
      <Stack gap={"1rem"}>
        <Box>
          <Button variant="outlined" onClick={() => setInsertOpen(true)}>
            create deal <Add />
          </Button>
        </Box>
        {isSuccess ? (
          <Box
            sx={{
              height: `calc(100vh - ${heightSubstract}px)`,
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
