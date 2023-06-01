import { useOrganization, useUser } from "@clerk/nextjs";
import { Delete, Visibility } from "@mui/icons-material";
import { IconButton, Link, Stack } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Image from "next/image";
import { useMemo } from "react";

type Member = {
  role: string;
  publicUserData: {
    firstName: string | null;
    lastName: string | null;
    imageUrl: string;
    profileImageUrl: string;
    identifier: string;
    userId: string;
  };
};

export default function Page() {
  const { membershipList, membership } = useOrganization({
    membershipList: {},
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
          const data = params.row as Member;

          return (
            <Stack direction={"row"} gap={"0.5rem"}>
              <Link href={`/user/${data.publicUserData.userId}`}>
                <IconButton size="small" sx={{ color: "primary.main" }} title="View">
                  <Visibility />
                </IconButton>
              </Link>
              {membership?.role === "admin" ? (
                <IconButton
                  onClick={() => {
                    // setUpdateData(data);
                    // setDeleteOpen(true);
                  }}
                  size="small"
                  color="warning"
                  title="Delete"
                >
                  <Delete />
                </IconButton>
              ) : null}
            </Stack>
          );
        },
      },
      {
        field: "imageUrl",
        headerName: "",
        renderCell: (params) => {
          const data = params.row as Member;
          return (
            <Image
              style={{ borderRadius: "100%" }}
              width={35}
              height={35}
              src={data.publicUserData.profileImageUrl}
              alt="member profile image"
            />
          );
        },
        width: 60,
      },
      {
        field: "identifier",
        headerName: "Identifier",
        valueGetter: (params) => {
          const data = params.row as Member;
          return data.publicUserData.identifier;
        },
        flex: 1,
        minWidth: 170,
      },
      {
        field: "role",

        headerName: "Role",
        flex: 1,
      },
      {
        field: "First name",
        valueGetter: (params) => {
          const data = params.row as Member;
          return data.publicUserData.firstName;
        },
        headerName: "First name",
        flex: 1,
      },
      {
        field: "Last name",
        valueGetter: (params) => {
          const data = params.row as Member;
          return data.publicUserData.lastName;
        },
        headerName: "Last name",
        flex: 1,
      },
    ],
    []
  );

  // publicUserData -> first name
  // publicUserData -> last name

  return (
    <>{membershipList ? <DataGrid rowSelection={false} rows={membershipList} columns={columns} /> : null}</>
  );
}
