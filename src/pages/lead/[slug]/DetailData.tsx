import { Grid, IconButton } from "@mui/material";
import type { LeadData } from "..";
import ItemDisplay from "@/components/ItemDisplay";
import dayjs from "dayjs";
import { Edit } from "@mui/icons-material";

export default function DetailData({ lead }: { lead: LeadData }) {
  return (
    <Grid py={3} container columnGap={6} rowGap={4}>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay label="First name" content={lead?.firstName} />
      </Grid>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay label="Last name" content={lead?.lastName} />
      </Grid>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay
          label="Status"
          tooltip={
            <IconButton color="primary" size="small">
              <Edit sx={{ width: "1rem", height: "1rem" }} />
            </IconButton>
          }
          content={lead?.status?.label}
        />
      </Grid>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay label="Company" content={lead?.company} />
      </Grid>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay label="Title" content={lead?.title} />
      </Grid>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay label="Email" href={`mailto:${lead?.email}`} content={lead?.email} />
      </Grid>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay label="Phone" href={lead?.phone ? `tel:${lead?.phone}` : null} content={lead?.phone} />
      </Grid>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay label="Location" content={lead?.location} />
      </Grid>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay
          label="Owner"
          href={lead?.owner ? `/user/${lead?.owner}` : null}
          content={lead?.ownerFullname}
        />
      </Grid>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay label="Created by" content={lead?.createdBy} />
      </Grid>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay label="Updated by" content={lead?.updatedBy} />
      </Grid>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay
          label="Created at"
          content={dayjs(lead?.createdAt?.toString())?.format("DD/MM/YYYY HH:mm")}
        />
      </Grid>
      <Grid justifySelf={"start"} xs={5} md={3} lg={2}>
        <ItemDisplay
          label="Updated at"
          content={dayjs(lead?.updatedAt?.toString())?.format("DD/MM/YYYY HH:mm")}
        />
      </Grid>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay label="Team" content={lead?.teamName} />
      </Grid>
      <Grid
        xs={12}
        md={lead?.comment && lead?.comment?.length > 40 ? 6 : 3}
        lg={lead?.comment && lead?.comment?.length > 40 ? 6 : 2}
      >
        <ItemDisplay label="Comment" content={lead?.comment} />
      </Grid>
    </Grid>
  );
}
