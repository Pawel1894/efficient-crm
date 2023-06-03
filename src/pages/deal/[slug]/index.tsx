import { useSystemStore } from "@/pages/_app";
import { api } from "@/utils/api";
import { Breadcrumbs, Button, Divider, IconButton, Stack, Typography } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import type { DealData } from "..";
import Head from "next/head";
import Update from "../Update";
import DeleteDialog from "@/components/DeleteDialog";
import { Delete, Edit, KeyboardArrowLeft } from "@mui/icons-material";
import DetailData from "./DetailData";
import AdaptiveHeader from "@/components/AdaptiveHeader";
import SkeletonTemplate from "@/pages/team/[slug]/Skeleton";

export default function Page() {
  const router = useRouter();
  const {
    data: deal,
    isError,
    error: fetchError,
    isLoading,
  } = api.deal.get.useQuery(router.query.slug as string);
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [updateData, setUpdateData] = useState<DealData>();
  const [updateOpen, setUpdateOpen] = useState(false);
  const { mutate: deleteDeal, isLoading: isDeleting } = api.deal.delete.useMutation();
  const context = api.useContext();
  useEffect(() => {
    setBreadcrumbs(
      <Breadcrumbs aria-label="breadcrumb">
        <Link style={{ textDecoration: "unset" }} href={"/deal"}>
          <Typography color={"text.primary"} component="span" variant="body2">
            Deals
          </Typography>
        </Link>
        <Typography color="text.primary">Deal #{deal?.id}</Typography>
      </Breadcrumbs>
    );
  }, [setBreadcrumbs, deal]);

  async function handleDelete(confirmed: boolean, id?: string) {
    if (confirmed && id) {
      deleteDeal(id);
      await router.push("/deal");
    }

    setDeleteOpen(false);
    return;
  }

  async function onUpdateSettled() {
    if (deal) await context.deal.get.invalidate(deal.id);
  }

  return (
    <>
      <Head>
        <title>Deal</title>
      </Head>
      {updateData ? (
        <>
          <Update
            onSettledHandler={onUpdateSettled}
            data={updateData}
            isOpen={updateOpen}
            setOpen={setUpdateOpen}
          />{" "}
          <DeleteDialog
            id={updateData?.id}
            isDeleting={isDeleting}
            open={deleteOpen}
            handleClose={handleDelete}
          />{" "}
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
              <Button
                onClick={() => {
                  setUpdateData(deal);
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
                  setUpdateData(deal);
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
          {isLoading && <SkeletonTemplate />}
          {deal ? <DetailData deal={deal} /> : null}
        </>
      )}
    </>
  );
}
