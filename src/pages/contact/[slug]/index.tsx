import { useSystemStore } from "@/pages/_app";
import { api } from "@/utils/api";
import { Delete, Edit, Remove } from "@mui/icons-material";
import { Breadcrumbs, Button, Divider, Stack, Typography, useMediaQuery } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import dayjs from "dayjs";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import type { ContactData } from "..";
import Update from "../Update";
import DeleteDialog from "@/components/DeleteDialog";
import { getAuth } from "@clerk/nextjs/server";
import { createTRPCContext } from "@/server/api/trpc";
import superjson from "superjson";
import { createServerSideHelpers } from "@trpc/react-query/server";
import type { InferGetServerSidePropsType, NextApiRequest, NextApiResponse } from "next";
import { appRouter } from "@/server/api/root";
import { Contact, Dictionary } from "@prisma/client";
import { TRPCError } from "@trpc/server";

export default function Page({ error, initData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  console.log("errorerrorerror", error);
  const router = useRouter();
  const {
    data: contact,
    isSuccess,
    isError,
    error: fetchError,
  } = api.contact.get.useQuery(router.query.slug as string, {
    initialData: initData ?? [],
  });
  const { mutate: deleteContact, isLoading: isDeleting } = api.contact.delete.useMutation();
  const [updateData, setUpdateData] = useState<ContactData>();
  const [updateOpen, setUpdateOpen] = useState(false);
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    setBreadcrumbs(
      <Breadcrumbs aria-label="breadcrumb">
        <Link style={{ textDecoration: "unset" }} href={"/contact"}>
          <Typography color={"text.primary"} component="span" variant="body2">
            Contacts
          </Typography>
        </Link>
        <Typography color="text.primary">{`${contact?.firstName ?? ""} ${
          contact?.lastName ?? ""
        }`}</Typography>
      </Breadcrumbs>
    );
  }, [setBreadcrumbs, contact]);

  async function handleDelete(confirmed: boolean, id?: string) {
    if (confirmed && id) {
      deleteContact(id);
      await router.push("/contact");
    }

    setDeleteOpen(false);
    return;
  }

  return (
    <>
      <Head>
        <title>
          Contact - {contact?.firstName} {contact?.lastName}
        </title>
      </Head>
      {contact?.id ? (
        <DeleteDialog id={contact?.id} isDeleting={isDeleting} open={deleteOpen} handleClose={handleDelete} />
      ) : null}
      {updateData ? <Update data={updateData} isOpen={updateOpen} setOpen={setUpdateOpen} /> : null}
      {isError || error ? (
        <span>{error ? error : fetchError?.message}</span>
      ) : (
        <>
          <Stack pb={3} direction={"row"} gap={2}>
            <Button
              onClick={() => {
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
                setUpdateData(contact);
                setUpdateOpen(true);
              }}
              variant="outlined"
              title="Edit"
              endIcon={<Edit />}
            >
              Update
            </Button>
          </Stack>
          <Divider />
          <Grid py={3} container columnGap={6} rowGap={4}>
            <Grid xs={5} md={3} lg={2}>
              <Stack>
                <Typography variant="overline" component={"span"}>
                  First name
                </Typography>
                <Typography
                  title={contact?.firstName}
                  sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  variant="h6"
                  component={"span"}
                >
                  {isSuccess ? contact?.firstName : "---"}
                </Typography>
              </Stack>
            </Grid>
            <Grid xs={5} md={3} lg={2}>
              <Stack>
                <Typography variant="overline" component={"span"}>
                  Last name
                </Typography>
                <Typography
                  sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  variant="h6"
                  component={"span"}
                  title={contact?.lastName}
                >
                  {isSuccess ? contact?.lastName : "---"}
                </Typography>
              </Stack>
            </Grid>
            <Grid xs={5} md={3} lg={2}>
              <Stack>
                <Typography variant="overline" component={"span"}>
                  Company
                </Typography>
                <Typography
                  sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  variant="h6"
                  component={"span"}
                  title={contact?.company ?? ""}
                >
                  {isSuccess && contact?.company ? contact?.company : "---"}
                </Typography>
              </Stack>
            </Grid>
            <Grid xs={5} md={3} lg={2}>
              <Stack>
                <Typography variant="overline" component={"span"}>
                  Title
                </Typography>
                <Typography
                  sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  variant="h6"
                  component={"span"}
                  title={contact?.title ?? ""}
                >
                  {isSuccess && contact.title ? contact.title : "---"}
                </Typography>
              </Stack>
            </Grid>

            <Grid xs={5} md={3} lg={2}>
              <Stack>
                <Typography variant="overline" component={"span"}>
                  Email
                </Typography>
                <Typography
                  sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  variant="h6"
                  component={"span"}
                  title={contact?.email ?? ""}
                >
                  {isSuccess ? contact?.email : "---"}
                </Typography>
              </Stack>
            </Grid>
            <Grid xs={5} md={3} lg={2}>
              <Stack>
                <Typography variant="overline" component={"span"}>
                  Phone
                </Typography>
                <Typography
                  sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  variant="h6"
                  component={"span"}
                  title={contact?.phone ?? ""}
                >
                  {isSuccess && contact?.phone ? contact?.phone : "---"}
                </Typography>
              </Stack>
            </Grid>
            <Grid xs={5} md={3} lg={2}>
              <Stack>
                <Typography variant="overline" component={"span"}>
                  Location
                </Typography>
                <Typography
                  sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  variant="h6"
                  component={"span"}
                  title={contact?.location ?? ""}
                >
                  {isSuccess && contact?.location ? contact?.location : "---"}
                </Typography>
              </Stack>
            </Grid>
            <Grid xs={5} md={3} lg={2}>
              <Stack>
                <Typography variant="overline" component={"span"}>
                  Owner
                </Typography>
                {isSuccess ? (
                  contact?.owner ? (
                    <Link href={`/user/${contact?.owner}`}>
                      <Typography
                        sx={{
                          textOverflow: "ellipsis",
                          overflow: "hidden",
                        }}
                        color="text.primary"
                        variant="h6"
                        component={"span"}
                      >
                        {contact?.ownerFullname ?? "None"}
                      </Typography>
                    </Link>
                  ) : (
                    <Typography
                      sx={{
                        textOverflow: "ellipsis",
                        overflow: "hidden",
                      }}
                      variant="h6"
                      component={"span"}
                    >
                      {contact?.ownerFullname ?? "None"}
                    </Typography>
                  )
                ) : null}
              </Stack>
            </Grid>
            <Grid xs={5} md={3} lg={2}>
              <Stack>
                <Typography variant="overline" component={"span"}>
                  Type
                </Typography>
                <Typography
                  sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  variant="h6"
                  component={"span"}
                  title={contact?.type?.label ?? ""}
                >
                  {isSuccess && contact?.type?.label ? contact?.type?.label : "---"}
                </Typography>
              </Stack>
            </Grid>
            <Grid xs={5} md={3} lg={2}>
              <Stack>
                <Typography variant="overline" component={"span"}>
                  Created by
                </Typography>
                <Typography
                  sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  variant="h6"
                  component={"span"}
                  title={contact?.createdBy ?? ""}
                >
                  {isSuccess && contact?.createdBy ? contact?.createdBy : "---"}
                </Typography>
              </Stack>
            </Grid>
            <Grid xs={5} md={3} lg={2}>
              <Stack>
                <Typography variant="overline" component={"span"}>
                  Updated by
                </Typography>
                <Typography
                  sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  variant="h6"
                  component={"span"}
                  title={contact?.updatedBy ?? ""}
                >
                  {isSuccess && contact?.updatedBy ? contact?.updatedBy : "---"}
                </Typography>
              </Stack>
            </Grid>
            <Grid xs={5} md={3} lg={2}>
              <Stack>
                <Typography variant="overline" component={"span"}>
                  Created at
                </Typography>
                <Typography
                  sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  variant="h6"
                  component={"span"}
                >
                  {isSuccess ? dayjs(contact?.createdAt?.toString()).format("DD/MM/YYYY HH:mm") : ""}
                </Typography>
              </Stack>
            </Grid>
            <Grid justifySelf={"start"} xs={5} md={3} lg={2}>
              <Stack>
                <Typography variant="overline" component={"span"}>
                  Updated at
                </Typography>
                <Typography
                  sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  variant="h6"
                  component={"span"}
                >
                  {isSuccess ? dayjs(contact?.updatedAt?.toString()).format("DD/MM/YYYY HH:mm") : ""}
                </Typography>
              </Stack>
            </Grid>
            <Grid xs={5} md={3} lg={2}>
              <Stack>
                <Typography variant="overline" component={"span"}>
                  Team
                </Typography>
                <Typography
                  sx={{
                    textOverflow: "ellipsis",
                    overflow: "hidden",
                  }}
                  variant="h6"
                  component={"span"}
                  title={contact?.teamName}
                >
                  {isSuccess ? contact?.teamName : "---"}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
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
    const contact = await helpers.contact.get.fetch(params.slug);

    return {
      props: {
        initData: JSON.stringify(contact),
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
