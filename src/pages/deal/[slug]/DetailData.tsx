import React from "react";
import type { DealData } from "..";
import { Grid } from "@mui/material";
import ItemDisplay from "@/components/ItemDisplay";
import { formatToThousands } from "@/helper";
import dayjs from "dayjs";

type Props = {
  deal: DealData;
};

export default function DetailData({ deal }: Props) {
  return (
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
        />
      </Grid>
      <Grid xs={5} md={3} lg={2} item>
        <ItemDisplay label="Stage" content={deal.stage?.label} />
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
  );
}
