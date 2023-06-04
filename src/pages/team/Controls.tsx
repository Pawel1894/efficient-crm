import AdaptiveHeader from "@/components/AdaptiveHeader";
import DeleteDialog from "@/components/DeleteDialog";
import InviteMember from "@/components/InviteMember";
import RenameOrganization from "@/components/RenameOrganization";
import { api } from "@/utils/api";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { Delete, Edit, Mail } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

export default function Controls() {
  const renameRef = useRef<HTMLButtonElement>(null);
  const inviteRef = useRef<HTMLButtonElement>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { organization } = useOrganization();
  const { setActive, organizationList } = useOrganizationList();
  const { mutate: setSettings } = api.user.setSettings.useMutation();
  const { mutate: removeTeamData } = api.user.removeTeamData.useMutation();
  const [renameOpen, setRenameOpen] = useState(false);
  const [inviteOpen, setInviteOpen] = useState(false);
  const context = api.useContext();
  const { membership } = useOrganization();
  async function deleteOrganization(confirm: boolean) {
    setIsDeleting(true);
    if (confirm && organization) {
      try {
        await organization?.destroy();
        if (setActive && organizationList.length) {
          const foundOrg = organizationList.find((i) => i.organization.id !== organization.id);
          const id = foundOrg ? foundOrg.organization.id : null;
          setSettings(id);

          await setActive({
            organization: id,
          });
        }
        removeTeamData(organization.id);
        await context.system.getMembershipList.invalidate();
      } catch (error) {
        const err = error as {
          errors: Array<{ message: string }>;
        };
        toast.error(err?.errors[0]?.message);
      }
    }

    setIsDeleting(false);
    setDeleteOpen(false);
  }

  return (
    <>
      <InviteMember itemRef={inviteRef} open={inviteOpen} setOpen={setInviteOpen} />
      <RenameOrganization itemRef={renameRef} open={renameOpen} setOpen={setRenameOpen} />
      <DeleteDialog isDeleting={isDeleting} open={deleteOpen} handleClose={deleteOrganization} />
      <Stack mb={3} direction={"row"} gap={2}>
        <AdaptiveHeader padding="0rem">
          {membership?.role === "admin" ? (
            <Button
              onClick={() => setDeleteOpen(true)}
              color="warning"
              variant="outlined"
              title="Delete"
              endIcon={<Delete />}
            >
              Delete
            </Button>
          ) : (
            <></>
          )}
          <Button
            onClick={() => setRenameOpen(true)}
            ref={renameRef}
            variant="outlined"
            title="Rename"
            endIcon={<Edit />}
          >
            Rename
          </Button>
          <Button
            onClick={() => setInviteOpen(true)}
            ref={inviteRef}
            variant="outlined"
            title="Invite member"
            endIcon={<Mail />}
          >
            Invite member
          </Button>
        </AdaptiveHeader>
      </Stack>
    </>
  );
}
