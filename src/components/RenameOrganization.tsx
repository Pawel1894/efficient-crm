import { useOrganization } from "@clerk/nextjs";
import { Box, Button, CircularProgress, Popover, Stack, TextField, Typography } from "@mui/material";
import React, { useState } from "react";

type Props = {
  itemRef: React.RefObject<HTMLElement>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
};

export default function RenameOrganization({ itemRef, open, setOpen }: Props) {
  const { organization } = useOrganization();
  const [isError, setIsError] = useState(false);
  const [organizationName, setOrganizationName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  async function renameOrg() {
    if (!organizationName) {
      setIsError(true);
      return;
    }

    setIsLoading(true);
    if (organization) await organization.update({ name: organizationName });
    setIsLoading(false);
    setOpen(false);
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
      <Stack width={300} height={150} p={2}>
        {isLoading ? (
          <Box mx={"auto"} mt={4}>
            <CircularProgress />
          </Box>
        ) : (
          <>
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
            <Button variant="outlined" sx={{ marginTop: "1rem" }} onClick={() => void renameOrg()}>
              Create organization
            </Button>
          </>
        )}
      </Stack>
    </Popover>
  );
}
