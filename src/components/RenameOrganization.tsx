import { useOrganization } from "@clerk/nextjs";
import { Box, Button, CircularProgress, Popover, Stack, TextField } from "@mui/material";
import React, { type FormEvent, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  itemRef: React.RefObject<HTMLElement>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
};

export default function RenameOrganization({ itemRef, open, setOpen }: Props) {
  const { organization } = useOrganization();

  const [organizationName, setOrganizationName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  async function renameOrg(e: FormEvent) {
    e.preventDefault();

    setIsLoading(true);
    if (organization) {
      try {
        await organization.update({ name: organizationName });
      } catch (error) {
        const err = error as {
          errors: Array<{ message: string }>;
        };
        toast.error(err?.errors[0]?.message);
      }
    }
    setIsLoading(false);
    setOpen(false);
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
      <Stack width={300} minHeight={150} p={2}>
        {isLoading ? (
          <Box mx={"auto"} mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={(e) => void renameOrg(e)}>
            <Stack>
              <TextField
                required
                type="text"
                placeholder="Team name.."
                name="organizationName"
                value={organizationName}
                onChange={(e) => setOrganizationName(e.currentTarget.value)}
              />
              <Button variant="outlined" sx={{ marginTop: "1rem" }} type="submit">
                Create organization
              </Button>
            </Stack>
          </form>
        )}
      </Stack>
    </Popover>
  );
}
