import { api } from "@/utils/api";
import { useOrganizationList } from "@clerk/nextjs";
import { Button, Popover, Stack, TextField, Typography } from "@mui/material";
import React, { FormEvent, FormEventHandler, useState } from "react";

type Props = {
  onClickHandler: (id: string) => void;
  itemRef: React.RefObject<HTMLElement>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
};

export default function CreateOrganization({ itemRef, onClickHandler, open, setOpen }: Props) {
  const { mutate: setSettings } = api.user.setSettings.useMutation();
  const { createOrganization, setActive } = useOrganizationList();
  const [organizationName, setOrganizationName] = useState("");
  const [isError, setIsError] = useState(false);

  async function onSubmit() {
    if (createOrganization && organizationName) {
      const organization = await createOrganization({ name: organizationName });
      setOrganizationName("");
      await setActive({ organization });
      setSettings(organization.id);
      setOpen(false);
      setIsError(false);
    } else if (!organizationName) {
      setIsError(true);
    }
  }

  return (
    <Popover
      open={open}
      anchorEl={itemRef.current}
      onClose={() => {
        setIsError(false);
        setOpen(false);
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Stack p={2}>
        <TextField
          onFocus={() => setIsError(false)}
          type="text"
          placeholder="Team name.."
          name="organizationName"
          value={organizationName}
          onChange={(e) => setOrganizationName(e.currentTarget.value)}
        />
        {isError && (
          <Typography sx={{ mt: "0.5rem" }} component={"span"} variant="subtitle2" color={"error.main"}>
            Name cannot be empty!
          </Typography>
        )}
        <Button variant="outlined" sx={{ marginTop: "1rem" }} onClick={() => void onSubmit()}>
          Create organization
        </Button>
      </Stack>
    </Popover>
  );
}
