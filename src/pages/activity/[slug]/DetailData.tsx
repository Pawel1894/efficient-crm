import React, { useRef, useState } from "react";
import { ActivityData } from "..";
import { api } from "@/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import DictionaryPopover from "@/components/DictionaryPopover";
import UsersPopover from "@/components/UsersPopover";
import { Grid, IconButton } from "@mui/material";
import ItemDisplay from "@/components/ItemDisplay";
import { Edit } from "@mui/icons-material";
import dayjs from "dayjs";
import { Dictionary } from "@prisma/client";
import { toast } from "react-toastify";

type Props = {
  activity: ActivityData;
};

export default function DetailData({ activity }: Props) {
  const [statusOpen, setStatusOpen] = useState<boolean>(false);
  const [ownerOpen, setOwnerOpen] = useState<boolean>(false);
  const statusRef = useRef<HTMLButtonElement>(null);
  const ownerRef = useRef<HTMLButtonElement>(null);
  const { data: statuses } = api.dictionary.byType.useQuery("ACTIVITY_STATUS");
  const context = api.useContext();
  const queryClient = useQueryClient();

  const { mutate: updateOwner } = api.activity.assignOwner.useMutation({
    onMutate: ({ activityId, owner }) => {
      const currentData = context.activity.get.getData(activityId);
      const key = [["activity", "get"], { input: activityId, type: "query" }];

      queryClient.setQueryData(key, () => {
        return { ...currentData, owner: owner.id, ownerFullname: owner.fullname };
      });

      return { currentData, key: key };
    },
    onError: (err, input, context) => {
      if (context?.currentData) queryClient.setQueryData(context?.key, context?.currentData);
      toast.error(err.message);
    },
    onSettled: async () => {
      await context.activity.get.invalidate(activity.id);
    },
  });
  const { mutate: updateStatus } = api.activity.assignStatus.useMutation({
    onMutate: ({ activityId, status }) => {
      const currentData = context.activity.get.getData(activityId);
      const key = [["activity", "get"], { input: activityId, type: "query" }];

      queryClient.setQueryData(key, () => {
        return { ...currentData, status: status };
      });

      return { currentData, key: key };
    },
    onError: (err, input, context) => {
      if (context?.currentData) queryClient.setQueryData(context?.key, context?.currentData);
      toast.error(err.message);
    },
    onSettled: async () => {
      await context.activity.get.invalidate(activity.id);
    },
  });

  function onStatusClickHandler(status: Dictionary) {
    updateStatus({
      activityId: activity.id,
      status,
    });

    setStatusOpen(false);
  }

  function onOwnerClickHandler(owner: { id: string; fullname: string }) {
    updateOwner({
      activityId: activity.id,
      owner,
    });

    setOwnerOpen(false);
  }

  return (
    <>
      {statuses ? (
        <DictionaryPopover
          data={statuses}
          onClickHandler={onStatusClickHandler}
          setOpen={setStatusOpen}
          open={statusOpen}
          itemRef={statusRef}
        />
      ) : null}

      <UsersPopover
        onClickHandler={onOwnerClickHandler}
        setOpen={setOwnerOpen}
        open={ownerOpen}
        itemRef={ownerRef}
      />

      <Grid py={3} container columnGap={6} rowGap={4}>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay
            href={activity.owner ? `/user/${activity.owner}` : null}
            label="Owner"
            content={activity.ownerFullname}
            tooltip={
              <IconButton
                onClick={() => setOwnerOpen((prev) => !prev)}
                ref={ownerRef}
                color="primary"
                size="small"
              >
                <Edit sx={{ width: "1rem", height: "1rem" }} />
              </IconButton>
            }
          />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Date" content={dayjs(activity?.date?.toString())?.format("DD/MM/YYYY HH:mm")} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay
            label="Status"
            content={activity.status?.label}
            tooltip={
              <IconButton
                onClick={() => setStatusOpen((prev) => !prev)}
                ref={statusRef}
                color="primary"
                size="small"
              >
                <Edit sx={{ width: "1rem", height: "1rem" }} />
              </IconButton>
            }
          />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay
            label="Lead"
            content={activity.lead ? activity.lead.firstName + " " + activity.lead.lastName : null}
          />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Description" content={activity.description} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Title" content={activity.title} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Location" content={activity.location} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Team" content={activity.teamName} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Created by" content={activity?.createdBy} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Updated by" content={activity?.updatedBy} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay
            label="Created at"
            content={dayjs(activity?.createdAt?.toString())?.format("DD/MM/YYYY HH:mm")}
          />
        </Grid>
        <Grid justifySelf={"start"} xs={5} md={3} lg={2} item>
          <ItemDisplay
            label="Updated at"
            content={dayjs(activity?.updatedAt?.toString())?.format("DD/MM/YYYY HH:mm")}
          />
        </Grid>
      </Grid>
    </>
  );
}
