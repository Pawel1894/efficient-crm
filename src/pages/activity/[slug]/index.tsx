import { useSystemStore } from "@/pages/_app";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { api } from "@/utils/api";
import { getAuth } from "@clerk/nextjs/server";
import { Breadcrumbs, Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import { Activity } from "@prisma/client";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { TRPCError } from "@trpc/server";
import type { InferGetServerSidePropsType, NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import superjson from "superjson";
import type { ActivityData } from "..";
import Head from "next/head";
import Update from "../Update";
import DeleteDialog from "@/components/DeleteDialog";
import { Delete, Edit, KeyboardArrowLeft } from "@mui/icons-material";
import DetailData from "./DetailData";
import AdaptiveHeader from "@/components/AdaptiveHeader";
import Link from "next/link";
export default function Page({ error, initData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs);
  const {
    data: activity,
    isError,
    error: fetchError,
  } = api.activity.get.useQuery(router.query.slug as string, {
    initialData: initData ? (JSON.parse(initData) as Activity) : [],
  });
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateData, setUpdateData] = useState<ActivityData>();
  const [updateOpen, setUpdateOpen] = useState(false);
  const { mutate: deleteActivity, isLoading: isDeleting } = api.activity.delete.useMutation();
  const context = api.useContext();

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
    await context.activity.get.invalidate(activity.id);
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

      {isError || error ? (
        <span>{error ? error : fetchError?.message}</span>
      ) : (
        <>
          <Stack pb={3} direction={"row"} gap={2} alignItems={"center"}>
            <IconButton onClick={() => router.back()}>
              <KeyboardArrowLeft />
            </IconButton>
            <AdaptiveHeader>
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
          <DetailData activity={activity} />
        </>
      )}
    </>
  );
}

export const getServerSideProps = async ({
  params,
  req,
  res,
}: {
  params: { slug: string };
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const session = getAuth(req);
  if (!session?.userId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const helpers = createServerSideHelpers({
    router: appRouter,
    ctx: createTRPCContext({
      req: req,
      res: res,
    }),
    transformer: superjson,
  });

  try {
    const activity = await helpers.activity.get.fetch(params.slug);

    return {
      props: {
        initData: JSON.stringify(activity),
        error: null,
      },
    };
  } catch (error) {
    let message = "Unknown Error!, please contact admin";
    if (error instanceof TRPCError) {
      message = error.message;
    }

    return {
      props: {
        initData: null,
        error: message,
      },
    };
  }
};
