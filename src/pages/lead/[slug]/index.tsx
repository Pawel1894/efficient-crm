import { useSystemStore } from "@/pages/_app";
import { appRouter } from "@/server/api/root";
import { createTRPCContext } from "@/server/api/trpc";
import { getAuth } from "@clerk/nextjs/server";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { TRPCError } from "@trpc/server";
import type { InferGetServerSidePropsType, NextApiRequest, NextApiResponse } from "next";
import React, { useEffect, useState } from "react";
import superjson from "superjson";
import { LeadData } from "..";
import { api } from "@/utils/api";
import { Delete, Edit, KeyboardArrowLeft } from "@mui/icons-material";
import { Box, Breadcrumbs, Button, Divider, IconButton, Stack, Tab, Tabs, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import Head from "next/head";
import Update from "../Update";
import DeleteDialog from "@/components/DeleteDialog";
import DetailData from "./DetailData";
import { TabPanel } from "@/components/TabPanel";
import Grid from "@/pages/deal/Grid";

export default function Page({ error, initData }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const {
    data: lead,
    isError,
    error: fetchError,
  } = api.lead.get.useQuery(router.query.slug as string, {
    initialData: initData ?? [],
  });
  const { mutate: deleteLead, isLoading: isDeleting } = api.lead.delete.useMutation();
  const [updateData, setUpdateData] = useState<LeadData>();
  const [updateOpen, setUpdateOpen] = useState(false);
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState(0);

  useEffect(() => {
    setBreadcrumbs(
      <Breadcrumbs aria-label="breadcrumb">
        <Link style={{ textDecoration: "unset" }} href={"/lead"}>
          <Typography color={"text.primary"} component="span" variant="body2">
            Leads
          </Typography>
        </Link>
        <Typography color="text.primary">{`${lead?.firstName ?? ""} ${lead?.lastName ?? ""}`}</Typography>
      </Breadcrumbs>
    );
  }, [setBreadcrumbs, lead]);

  async function handleDelete(confirmed: boolean, id?: string) {
    if (confirmed && id) {
      deleteLead(id);
      await router.push("/lead");
    }

    setDeleteOpen(false);
    return;
  }

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  return (
    <>
      <Head>
        <title>
          Lead - {lead?.firstName} {lead?.lastName}
        </title>
      </Head>
      {updateData ? (
        <>
          <Update data={updateData} isOpen={updateOpen} setOpen={setUpdateOpen} />{" "}
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
          <Stack pb={3} direction={"row"} gap={2}>
            <IconButton onClick={() => router.back()}>
              <KeyboardArrowLeft />
            </IconButton>
            <Button
              onClick={() => {
                setUpdateData(lead);
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
                setUpdateData(lead);
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
          <Tabs value={currentTab} onChange={handleTabChange} aria-label="basic tabs example">
            <Tab label="Details" />
            <Tab label="Deals" />
            <Tab label="Activities" />
          </Tabs>
          <TabPanel index={0} value={currentTab}>
            <DetailData lead={lead} />
          </TabPanel>
          <TabPanel index={1} value={currentTab}>
            <Box pt={2}>
              <Grid heightSubstract={300} leadId={router.query.slug as string} />
            </Box>
          </TabPanel>
          <TabPanel index={2} value={currentTab}>
            <span>2</span>
          </TabPanel>
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
    const lead = await helpers.lead.get.fetch(params.slug);

    return {
      props: {
        initData: JSON.stringify(lead),
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
