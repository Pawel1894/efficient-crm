import { Grid } from "@mui/material";
import type { ContactData } from "..";
import ItemDisplay from "@/components/ItemDisplay";
import dayjs from "dayjs";

export function DetailsData({ contact }: { contact: ContactData }) {
  return (
    <Grid py={3} container columnGap={6} rowGap={4}>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay label="First name" content={contact?.firstName} />
      </Grid>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay label="Last name" content={contact?.lastName} />
      </Grid>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay label="Company" content={contact?.company} />
      </Grid>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay label="Title" content={contact?.title} />
      </Grid>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay label="Email" content={contact?.email} />
      </Grid>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay label="Phone" content={contact?.phone} />
      </Grid>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay label="Location" content={contact?.location} />
      </Grid>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay
          label="Type"
          href={contact?.owner ? `/user/${contact?.owner}` : null}
          content={contact?.ownerFullname}
        />
      </Grid>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay label="Type" content={contact?.type?.label} />
      </Grid>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay label="Created by" content={contact?.createdBy} />
      </Grid>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay label="Updated by" content={contact?.updatedBy} />
      </Grid>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay
          label="Created at"
          content={dayjs(contact?.createdAt?.toString())?.format("DD/MM/YYYY HH:mm")}
        />
      </Grid>
      <Grid justifySelf={"start"} xs={5} md={3} lg={2}>
        <ItemDisplay
          label="Updated at"
          content={dayjs(contact?.updatedAt?.toString())?.format("DD/MM/YYYY HH:mm")}
        />
      </Grid>
      <Grid xs={5} md={3} lg={2}>
        <ItemDisplay label="Team" content={contact?.teamName} />
      </Grid>
    </Grid>
  );
}
