import { api } from "@/utils/api";
import { Breadcrumbs, Button, IconButton, Skeleton, Stack, Typography } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import DetailData from "./DetailData";
import { useEffect, useMemo, useState } from "react";
import { useSystemStore } from "@/pages/_app";
import Link from "next/link";
import { useOrganization } from "@clerk/nextjs";
import { Delete, KeyboardArrowLeft } from "@mui/icons-material";
import AdaptiveHeader from "@/components/AdaptiveHeader";
import { removeMember } from "@/helper";
import SkeletonTemplate from "./Skeleton";

export default function Page() {
  const router = useRouter();
  const {
    data: user,
    isError,
    error,
    isLoading,
    isSuccess,
    isRefetching,
  } = api.user.get.useQuery(router.query.slug as string, {
    retry: 1,
    retryDelay: 0,
  });
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs);
  const {
    organization,
    membershipList,
    membership: currentUser,
  } = useOrganization({
    membershipList: {},
  });
  const [isDeleting, setIsDeleting] = useState(false);

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

      {(isLoading || isRefetching || isDeleting) && (
        <>
          <Stack pb={3} direction={"row"} gap={2} alignItems={"center"}>
            <Skeleton variant="rectangular" width={80} height={30} />
            <Skeleton variant="rectangular" width={80} height={30} />
          </Stack>
          <SkeletonTemplate />
        </>
      )}

      {isSuccess && !isDeleting && !isRefetching && (
        <>
          <Stack pb={3} direction={"row"} gap={2} alignItems={"center"}>
            <IconButton onClick={() => router.back()}>
              <KeyboardArrowLeft />
            </IconButton>
            {currentUser?.role === "admin" && (
              <AdaptiveHeader>
                <Button
                  onClick={() => {
                    setIsDeleting(true);
                    void removeMember(
                      currentUser?.publicUserData.userId,
                      organization,
                      async () => {
                        await router.push("/team");
                      },
                      membership
                    ).finally(() => setIsDeleting(false));
                  }}
                  color="warning"
                  variant="outlined"
                  title="Delete"
                  endIcon={<Delete />}
                >
                  Delete
                </Button>
              </AdaptiveHeader>
            )}
          </Stack>
          <DetailData membership={membership} user={user} />
        </>
      )}
    </>
  );
}
