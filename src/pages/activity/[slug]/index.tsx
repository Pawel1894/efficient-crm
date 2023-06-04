import { useSystemStore } from "@/pages/_app";
import { api } from "@/utils/api";
import { Breadcrumbs, Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import type { ActivityData } from "..";
import Head from "next/head";
import Update from "../Update";
import DeleteDialog from "@/components/DeleteDialog";
import { Delete, Edit, KeyboardArrowLeft } from "@mui/icons-material";
import DetailData from "./DetailData";
import AdaptiveHeader from "@/components/AdaptiveHeader";
import Link from "next/link";
import SkeletonTemplate from "@/pages/team/[slug]/Skeleton";
import { useOrganization } from "@clerk/nextjs";
export default function Page() {
  const router = useRouter();
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs);
  const {
    data: activity,
    isError,
    error: fetchError,
    isLoading,
    isRefetching,
  } = api.activity.get.useQuery(router.query.slug as string, {
    retry: 1,
    retryDelay: 0,
  });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateData, setUpdateData] = useState<ActivityData>();
  const [updateOpen, setUpdateOpen] = useState(false);
  const { mutate: deleteActivity, isLoading: isDeleting } = api.activity.delete.useMutation();
  const context = api.useContext();
  const { membership } = useOrganization();
  useEffect(() => {
    setBreadcrumbs(
      <Breadcrumbs aria-label="breadcrumb">
        <Link style={{ textDecoration: "unset" }} href={"/activity"}>
          <Typography color={"text.primary"} component="span" variant="body2">
            Activities
          </Typography>
        </Link>
        <Typography color="text.primary">Activity #{activity?.id}</Typography>
      </Breadcrumbs>
    );
  }, [setBreadcrumbs, activity]);

  async function handleDelete(confirmed: boolean, id?: string) {
    if (confirmed && id) {
      deleteActivity(id);
      await router.push("/activity");
    }

    setDeleteOpen(false);
    return;
  }

  async function onUpdateSettled() {
    if (activity) await context.activity.get.invalidate(activity.id);
  }

  return (
    <>
      <Head>
        <title>Activity</title>
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
            id={updateData?.id}
            isDeleting={isDeleting}
            open={deleteOpen}
            handleClose={handleDelete}
          />
        </>
      ) : null}

      {isError ? (
        <span>{fetchError?.message}</span>
      ) : (
        <>
          <Stack pb={3} direction={"row"} gap={2} alignItems={"center"}>
            <IconButton onClick={() => router.back()}>
              <KeyboardArrowLeft />
            </IconButton>
            <AdaptiveHeader>
              {membership?.role === "admin" ? (
                <Button
                  onClick={() => {
                    setUpdateData(activity);
                    setDeleteOpen(true);
                  }}
                  color="warning"
                  variant="outlined"
                  title="Delete"
                  endIcon={<Delete />}
                >
                  Delete
                </Button>
              ) : (
                <></>
              )}
              <Button
                onClick={() => {
                  setUpdateData(activity);
                  setUpdateOpen(true);
                }}
                variant="outlined"
                title="Edit"
                endIcon={<Edit />}
              >
                Update
              </Button>
            </AdaptiveHeader>
          </Stack>
          <Divider />
          {(isLoading || isRefetching) && <SkeletonTemplate />}
          {activity && !isRefetching ? <DetailData activity={activity} /> : null}
        </>
      )}
    </>
  );
}
