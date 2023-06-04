import { api } from "@/utils/api";
import { useOrganizationList } from "@clerk/nextjs";
import { Button, CircularProgress, Popover, Stack, TextField } from "@mui/material";
import React, { type FormEvent, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  itemRef: React.RefObject<HTMLElement>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
};

export default function CreateOrganization({ itemRef, open, setOpen }: Props) {
  const { mutate: setSettings } = api.user.setSettings.useMutation();
  const { createOrganization, setActive } = useOrganizationList();
  const [organizationName, setOrganizationName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { mutate: createDicts } = api.dictionary.createDicts.useMutation();
  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (createOrganization && organizationName) {
      try {
        setIsLoading(true);
        const organization = await createOrganization({ name: organizationName });
        setOrganizationName("");
        await setActive({ organization });
        setSettings(organization.id);
        createDicts(organization.id);
        setOpen(false);
        setIsLoading(false);
      } catch (error) {
        const err = error as {
          errors: Array<{ message: string }>;
        };
        toast.error(err?.errors[0]?.message);
      }
    }
  }

  return (
    <Popover
      open={open}
      anchorEl={itemRef.current}
      onClose={() => {
        setOpen(false);
      }}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <Stack width={300} height={140} overflow={"hidden"}>
        {isLoading ? (
          <Stack mx={"auto"} mt={6}>
            <CircularProgress />
          </Stack>
        ) : (
          <form onSubmit={(e) => void onSubmit(e)}>
            <Stack p={2}>
              <TextField
                required
                type="text"
                placeholder="Team name.."
                name="organizationName"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.currentTarget.value)}
              />

              <Button type="submit" variant="outlined" sx={{ marginTop: "1rem" }}>
                Create organization
              </Button>
            </Stack>
          </form>
        )}
      </Stack>
    </Popover>
  );
}
