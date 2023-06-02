import { useOrganization, useUser } from "@clerk/nextjs";
import { Delete, Edit, KeyboardArrowLeft, Visibility } from "@mui/icons-material";
import {
  Box,
  Breadcrumbs,
  Button,
  Divider,
  IconButton,
  Link,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { DataGrid, type GridColDef } from "@mui/x-data-grid";
import Image from "next/image";
import { useEffect, useMemo } from "react";
import type { OrganizationMembershipResource } from "@clerk/types";
import Head from "next/head";
import { useSystemStore } from "../_app";
import Controls from "./Controls";

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
  const { membershipList, membership, organization } = useOrganization({
    membershipList: {},
  });
  const { user } = useUser();
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs);
  const remove = async (member: OrganizationMembershipResource) => {
    if (member.publicUserData.userId === user?.publicMetadata.userId) return;
    if (member.publicUserData.userId) {
      await organization?.removeMember(member.publicUserData.userId);
    }
  };

  useEffect(() => {
    setBreadcrumbs(
      <Breadcrumbs aria-label="breadcrumb">
        <Typography color="text.primary">Team Details</Typography>
      </Breadcrumbs>
    );
  }, [setBreadcrumbs]);

  const columns: GridColDef[] = useMemo(
    () => [
      {
        field: "action",
        headerName: "",
        filterable: false,
        hideable: false,
        sortable: false,
        renderCell: (params) => {
          const data = params.row as OrganizationMembershipResource;

          if (!data.publicUserData.userId) return "";

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
                    void remove(data);
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
    [membership?.role]
  );

  return (
    <>
      <Head>
        <title>Team {organization?.name}</title>
      </Head>
      <Controls />
      <>
        <Typography variant="h5">Members</Typography>
        <Box my={3} height={"50vh"} width={"100%"}>
          {!membershipList ? (
            <Skeleton animation="wave" variant="rectangular" width="100%" height="100%" />
          ) : (
            <DataGrid rowSelection={false} rows={membershipList} columns={columns} />
          )}
        </Box>
      </>
      <Divider />
      <>
        <Typography mt={3} variant="h5">
          Pending invites
        </Typography>
      </>
    </>
  );
}
