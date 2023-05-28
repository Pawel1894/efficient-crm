import React, { useRef, useState } from "react";
import type { DealData } from "..";
import { Grid, IconButton } from "@mui/material";
import ItemDisplay from "@/components/ItemDisplay";
import { formatToThousands } from "@/helper";
import dayjs from "dayjs";
import { api } from "@/utils/api";
import DictionaryPopover from "@/components/DictionaryPopover";
import UsersPopover from "@/components/UsersPopover";
import { Edit } from "@mui/icons-material";
import { Dictionary } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

type Props = {
  deal: DealData;
};

export default function DetailData({ deal }: Props) {
  const [stageOpen, setStageOpen] = useState<boolean>(false);
  const [ownerOpen, setOwnerOpen] = useState<boolean>(false);
  const stageRef = useRef<HTMLButtonElement>(null);
  const ownerRef = useRef<HTMLButtonElement>(null);
  const { data: stages } = api.dictionary.byType.useQuery("DEAL_STAGE");
  const context = api.useContext();
  const queryClient = useQueryClient();

  const { mutate: updateOwner } = api.deal.assignOwner.useMutation({
    onMutate: ({ dealId, owner }) => {
      const currentData = context.deal.get.getData(dealId);
      const key = [["deal", "get"], { input: dealId, type: "query" }];

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
      await context.lead.get.invalidate(deal.id);
    },
  });
  const { mutate: updateStage } = api.deal.assignStage.useMutation({
    onMutate: ({ dealId, stage }) => {
      const currentData = context.deal.get.getData(dealId);
      const key = [["deal", "get"], { input: dealId, type: "query" }];

      queryClient.setQueryData(key, () => {
        return { ...currentData, stage: stage };
      });

      return { currentData, key: key };
    },
    onError: (err, input, context) => {
      if (context?.currentData) queryClient.setQueryData(context?.key, context?.currentData);
      toast.error(err.message);
    },
    onSettled: async () => {
      await context.deal.get.invalidate(deal.id);
    },
  });

  function onStageClickHandler(stage: Dictionary) {
    updateStage({
      dealId: deal.id,
      stage,
    });

    setStageOpen(false);
  }

  function onOwnerClickHandler(owner: { id: string; fullname: string }) {
    updateOwner({
      dealId: deal.id,
      owner,
    });

    setOwnerOpen(false);
  }

  return (
    <>
      {stages ? (
        <DictionaryPopover
          data={stages}
          onClickHandler={onStageClickHandler}
          setOpen={setStageOpen}
          open={stageOpen}
          itemRef={stageRef}
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
          <ItemDisplay label="Forecast" content={"$ " + formatToThousands(deal.forecast)} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Value" content={deal?.value ? "$ " + formatToThousands(deal?.value) : "$ 0"} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay
            href={deal.owner ? `/user/${deal.owner}` : null}
            label="Owner"
            content={deal.ownerFullname}
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
          <ItemDisplay
            label="Stage"
            content={deal.stage?.label}
            tooltip={
              <IconButton
                onClick={() => setStageOpen((prev) => !prev)}
                ref={stageRef}
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
            href={deal.lead ? `/lead/${deal.lead.id}` : null}
            label="Lead"
            content={deal.lead ? deal.lead.firstName + " " + deal.lead.lastName : null}
          />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Team" content={deal?.teamName} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Comment" content={deal.comment} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Created by" content={deal?.createdBy} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Updated by" content={deal?.updatedBy} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay
            label="Created at"
            content={dayjs(deal?.createdAt?.toString())?.format("DD/MM/YYYY HH:mm")}
          />
        </Grid>
        <Grid justifySelf={"start"} xs={5} md={3} lg={2}>
          <ItemDisplay
            label="Updated at"
            content={dayjs(deal?.updatedAt?.toString())?.format("DD/MM/YYYY HH:mm")}
          />
        </Grid>
      </Grid>
    </>
  );
}
