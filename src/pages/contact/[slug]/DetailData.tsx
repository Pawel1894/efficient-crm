import { Grid, IconButton } from "@mui/material";
import type { ContactData } from "..";
import ItemDisplay from "@/components/ItemDisplay";
import dayjs from "dayjs";
import { useRef, useState } from "react";
import { api } from "@/utils/api";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Dictionary } from "@prisma/client";
import DictionaryPopover from "@/components/DictionaryPopover";
import UsersPopover from "@/components/UsersPopover";
import { Edit } from "@mui/icons-material";

export function DetailData({ contact }: { contact: ContactData }) {
  const [open, setOpen] = useState<boolean>(false);
  const [ownerOpen, setOwnerOpen] = useState<boolean>(false);
  const typeRef = useRef<HTMLButtonElement>(null);
  const ownerRef = useRef<HTMLButtonElement>(null);
  const context = api.useContext();
  const queryClient = useQueryClient();
  const { data: types } = api.dictionary.byType.useQuery("CONTACT_TYPE");
  const { mutate: updateOwner } = api.contact.assignOwner.useMutation({
    onMutate: ({ contactId, owner }) => {
      const currentData = context.contact.get.getData(contactId);
      const key = [["contact", "get"], { input: contactId, type: "query" }];

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
      await context.contact.get.invalidate(contact.id);
    },
  });
  const { mutate: updateType } = api.contact.assignType.useMutation({
    onMutate: ({ contactId, type }) => {
      const currentData = context.contact.get.getData(contactId);
      const key = [["contact", "get"], { input: contactId, type: "query" }];

      queryClient.setQueryData(key, () => {
        return { ...currentData, type: type };
      });

      return { currentData, key: key };
    },
    onError: (err, input, context) => {
      if (context?.currentData) queryClient.setQueryData(context?.key, context?.currentData);
      toast.error(err.message);
    },
    onSettled: async () => {
      await context.contact.get.invalidate(contact.id);
    },
  });

  function onTypeClickHandler(type: Dictionary) {
    updateType({
      contactId: contact.id,
      type: type,
    });

    setOpen(false);
  }

  function onOwnerClickHandler(owner: { id: string; fullname: string }) {
    updateOwner({
      contactId: contact.id,
      owner,
    });

    setOwnerOpen(false);
  }

  return (
    <>
      {types ? (
        <DictionaryPopover
          data={types}
          onClickHandler={onTypeClickHandler}
          setOpen={setOpen}
          open={open}
          itemRef={typeRef}
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
          <ItemDisplay label="First name" content={contact?.firstName} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Last name" content={contact?.lastName} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Company" content={contact?.company} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Title" content={contact?.title} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Email" href={`mailto:${contact?.email}`} content={contact?.email} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay
            label="Phone"
            href={contact?.phone ? `tel:${contact?.phone}` : null}
            content={contact?.phone}
          />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Location" content={contact?.location} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay
            label="Owner"
            href={contact?.owner ? `/user/${contact?.owner}` : null}
            content={contact?.ownerFullname}
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
            label="Type"
            content={contact?.type?.label}
            tooltip={
              <IconButton onClick={() => setOpen((prev) => !prev)} ref={typeRef} color="primary" size="small">
                <Edit sx={{ width: "1rem", height: "1rem" }} />
              </IconButton>
            }
          />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Team" content={contact?.teamName} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Created by" content={contact?.createdBy} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay label="Updated by" content={contact?.updatedBy} />
        </Grid>
        <Grid xs={5} md={3} lg={2} item>
          <ItemDisplay
            label="Created at"
            content={dayjs(contact?.createdAt?.toString())?.format("DD/MM/YYYY HH:mm")}
          />
        </Grid>
        <Grid justifySelf={"start"} xs={5} md={3} lg={2} item>
          <ItemDisplay
            label="Updated at"
            content={dayjs(contact?.updatedAt?.toString())?.format("DD/MM/YYYY HH:mm")}
          />
        </Grid>
      </Grid>
    </>
  );
}
