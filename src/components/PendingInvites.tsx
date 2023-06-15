import type { OrganizationInvitationResource } from "@clerk/types";
import { useOrganization } from "@clerk/nextjs";
import { Box, IconButton, Skeleton, Typography } from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import React, { useMemo } from "react";
import { Cancel } from "@mui/icons-material";
import dayjs from "dayjs";
import { api } from "@/utils/api";
import { toast } from "react-toastify";

export default function PendingInvites() {
  const { membership } = useOrganization();

  const {
    data: invitationList,
    refetch,
    isRefetching,
    isInitialLoading,
  } = api.system.getInvitedList.useQuery(undefined, {
    onError: (err) => {
      toast.error(err?.message);
    },
  });

  const { mutate: revokeInv, isLoading: revokingInv } = api.system.revokeInv.useMutation({
    onError: (err) => {
      toast.error(err?.message);
    },
    onSuccess: async () => {
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
        renderCell: (params) => {
          const data = params.row as OrganizationInvitationResource;

          return membership?.role === "admin" && data ? (
            <IconButton
              onClick={() => {
                revokeInv(data.id);
              }}
              size="small"
              color="warning"
              title="Cancel invite"
            >
              <Cancel />
            </IconButton>
          ) : null;
        },
      },
      {
        field: "emailAddress",
        headerName: "Email Address",
        flex: 1,
        minWidth: 170,
      },
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        minWidth: 170,
      },
      {
        field: "role",
        headerName: "Role",
        flex: 1,
        minWidth: 170,
      },
      {
        field: "createdAt",
        valueGetter: (params) => {
          const data = params.row as OrganizationInvitationResource;
          return dayjs(data?.createdAt?.toString())?.format("DD/MM/YYYY HH:mm");
        },
        headerName: "Created At",
        flex: 1,
        minWidth: 170,
      },
    ],
    [membership?.role]
  );

  return (
    <>
      <Typography mt={4} variant="h5">
        Pending invites
      </Typography>
      <Box my={3} height={"50vh"} minHeight={400} width={"100%"}>
        {isRefetching || isInitialLoading || revokingInv ? (
          <Skeleton animation="wave" variant="rectangular" width="100%" height="100%" />
        ) : invitationList?.length ? (
          <DataGrid
            initialState={{
              columns: {
                columnVisibilityModel: {
                  action: membership?.role !== "admin" ? false : true,
                },
              },
            }}
            rowSelection={false}
            rows={invitationList}
            columns={columns}
          />
        ) : (
          <Typography>No invites</Typography>
        )}
      </Box>
    </>
  );
}
