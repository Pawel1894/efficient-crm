import { api } from "@/utils/api";
import { Box, Breadcrumbs, Button, CircularProgress, IconButton, Stack, Typography } from "@mui/material";
import Head from "next/head";
import { OrganizationMembershipResource } from "@clerk/types";
import { useRouter } from "next/router";
import DetailData from "./DetailData";
import { useEffect, useMemo } from "react";
import { useSystemStore } from "@/pages/_app";
import Link from "next/link";
import { useOrganization, useUser } from "@clerk/nextjs";
import { Delete, KeyboardArrowLeft } from "@mui/icons-material";
import AdaptiveHeader from "@/components/AdaptiveHeader";
import { toast } from "react-toastify";
import { removeMember } from "@/helper";

export default function Page() {
  const router = useRouter();
  const {
    data: user,
    isError,
    error,
    isLoading,
    isSuccess,
  } = api.user.get.useQuery(router.query.slug as string);
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs);
  const { organization, membershipList } = useOrganization({
    membershipList: {},
  });
  const { user: currentUser } = useUser();

  useEffect(() => {
    setBreadcrumbs(
      <Breadcrumbs aria-label="breadcrumb">
        <Link style={{ textDecoration: "unset" }} href={"/team"}>
          <Typography color={"text.primary"} component="span" variant="body2">
            Team
          </Typography>
        </Link>
        <Typography color="text.primary">
          User {user?.firstName} {user?.lastName}
        </Typography>
      </Breadcrumbs>
    );
  }, [setBreadcrumbs, user?.firstName, user?.lastName]);

  const membership = useMemo(
    () => membershipList?.find((m) => m.publicUserData.userId === user?.id),
    [membershipList, user?.id]
  );

  return (
    <>
      <Head>
        <title>User</title>
      </Head>

      {isError && <Typography>{error.message}</Typography>}

      {isLoading && <CircularProgress />}

      {isSuccess && (
        <>
          <Stack pb={3} direction={"row"} gap={2} alignItems={"center"}>
            <IconButton onClick={() => router.back()}>
              <KeyboardArrowLeft />
            </IconButton>
            <AdaptiveHeader>
              <Button
                onClick={() => {
                  void removeMember(
                    currentUser?.id,
                    organization,
                    async () => {
                      await router.push("/team");
                    },
                    membership
                  );
                }}
                color="warning"
                variant="outlined"
                title="Delete"
                endIcon={<Delete />}
              >
                Delete
              </Button>
            </AdaptiveHeader>
          </Stack>
          <DetailData membership={membership} user={user} />
        </>
      )}
    </>
  );
}
