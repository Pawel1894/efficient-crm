import { useSystemStore } from "@/pages/_app";
import { api } from "@/utils/api";
import { Delete, Edit, KeyboardArrowLeft } from "@mui/icons-material";
import { Breadcrumbs, Button, Divider, IconButton, Stack, Typography } from "@mui/material";
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
import { TRPCError } from "@trpc/server";
import { DetailsData } from "./DetailData";

export default function Page({ error, initData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const {
    data: contact,
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
            <IconButton onClick={() => router.back()}>
              <KeyboardArrowLeft />
            </IconButton>
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
          <DetailsData contact={contact} />
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
