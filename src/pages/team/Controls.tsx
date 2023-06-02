import AdaptiveHeader from "@/components/AdaptiveHeader";
import DeleteDialog from "@/components/DeleteDialog";
import { api } from "@/utils/api";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Delete, Edit } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import React, { useState } from "react";

export default function Controls() {
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { organization } = useOrganization();
  const { setActive, organizationList } = useOrganizationList();
  const { mutate: setSettings } = api.user.setSettings.useMutation();

  async function deleteOrganization(confirm: boolean) {
    console.log(confirm);
    setIsDeleting(true);
    if (confirm && organization) {
      await organization?.destroy();
      if (setActive && organizationList.length) {
        const foundOrg = organizationList.find((i) => i.organization.id !== organization.id);
        const id = foundOrg ? foundOrg.organization.id : null;
        await setActive({
          organization: id,
        });
        console.log("id", id);
        console.log("org", organization.id);
        setSettings(id);
      }
    }

    setIsDeleting(false);
    setDeleteOpen(false);
  }

  return (
    <>
      <DeleteDialog isDeleting={isDeleting} open={deleteOpen} handleClose={deleteOrganization} />
      <Stack mb={3} direction={"row"} gap={2}>
        <AdaptiveHeader padding="0rem">
          <Button
            onClick={() => setDeleteOpen(true)}
            color="warning"
            variant="outlined"
            title="Delete"
            endIcon={<Delete />}
          >
            Delete
          </Button>
          <Button variant="outlined" title="Rename" endIcon={<Edit />}>
            Rename
          </Button>
        </AdaptiveHeader>
      </Stack>
    </>
  );
}
