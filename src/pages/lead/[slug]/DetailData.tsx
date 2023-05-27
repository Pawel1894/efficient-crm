import { Grid, IconButton, Paper } from "@mui/material";
import type { LeadData } from "..";
import ItemDisplay from "@/components/ItemDisplay";
import dayjs from "dayjs";
import { Edit } from "@mui/icons-material";
import { useRef, useState } from "react";
import DictionaryPopover from "@/components/DictionaryPopover";
import { api } from "@/utils/api";
import { Dictionary } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { getQueryKey } from "@trpc/react-query";
import { toast } from "react-toastify";

export default function DetailData({ lead }: { lead: LeadData }) {
  const [open, setOpen] = useState<boolean>(false);
  const statusRef = useRef<HTMLButtonElement>(null);
  const context = api.useContext();
  const queryClient = useQueryClient();
  const { data: statuses } = api.dictionary.byType.useQuery("LEAD_STATUS");
  const { mutate: updateStatus } = api.lead.assignStatus.useMutation({
    onMutate: ({ leadId, status }) => {
      const currentData = context.lead.get.getData(leadId);
      const key = [["lead", "get"], { input: leadId, type: "query" }];

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
      await context.lead.get.invalidate(lead.id);
    },
  });

  function onStatusClickHandler(status: Dictionary) {
    updateStatus({
      leadId: lead.id,
      status: status,
    });

    setOpen(false);
  }

  return (
    <>
      {statuses ? (
        <DictionaryPopover
          data={statuses}
          onClickHandler={onStatusClickHandler}
          setOpen={setOpen}
          open={open}
          itemRef={statusRef}
        />
      ) : null}
      <Grid py={3} container columnGap={6} rowGap={4}>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="First name" content={lead?.firstName} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Last name" content={lead?.lastName} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay
            label="Status"
            tooltip={
              <IconButton
                onClick={() => setOpen((prev) => !prev)}
                ref={statusRef}
                color="primary"
                size="small"
              >
                <Edit sx={{ width: "1rem", height: "1rem" }} />
              </IconButton>
            }
            content={lead?.status?.label}
          />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Company" content={lead?.company} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Title" content={lead?.title} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Email" href={`mailto:${lead?.email}`} content={lead?.email} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Phone" href={lead?.phone ? `tel:${lead?.phone}` : null} content={lead?.phone} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Location" content={lead?.location} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay
            label="Owner"
            href={lead?.owner ? `/user/${lead?.owner}` : null}
            content={lead?.ownerFullname}
          />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Created by" content={lead?.createdBy} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Updated by" content={lead?.updatedBy} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
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
        <Grid xs={5} md={3} lg={2} item>
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
    </>
  );
}
