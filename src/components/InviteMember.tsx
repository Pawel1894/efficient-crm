import { useOrganization } from "@clerk/nextjs";
import { OrganizationMembershipRole } from "@clerk/nextjs/server";
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Popover,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import React, { FormEvent, useState } from "react";
import { toast } from "react-toastify";

type Props = {
  itemRef: React.RefObject<HTMLElement>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
};

export default function InviteMember({ itemRef, open, setOpen }: Props) {
  const { organization } = useOrganization();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<OrganizationMembershipRole>("basic_member");

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (organization && email && role) {
      setIsLoading(true);
      try {
        await organization.inviteMember({ emailAddress: email, role });
      } catch (error) {
        const err = error as {
          errors: Array<{ message: string }>;
        };
        toast.error(err?.errors[0]?.message);
      }
      setEmail("");
      setRole("basic_member");
      setIsLoading(false);
      setOpen(false);
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
      <Stack p={2} width={300} height={250}>
        {isLoading ? (
          <Box mx={"auto"} mt={10}>
            <CircularProgress />
          </Box>
        ) : (
          <form onSubmit={(e) => void submit(e)}>
            <Stack gap={2}>
              <TextField
                type="email"
                required
                placeholder="Email"
                name="organizationName"
                value={email}
                onChange={(e) => setEmail(e.currentTarget.value)}
              />
              <FormControl>
                <FormLabel>Role</FormLabel>
                <RadioGroup
                  row
                  value={role}
                  onChange={(e) => setRole(e.currentTarget.value as OrganizationMembershipRole)}
                  name="radio-buttons-group"
                >
                  <FormControlLabel value="basic_member" control={<Radio />} label="Member" />
                  <FormControlLabel value="admin" control={<Radio />} label="Admin" />
                </RadioGroup>
              </FormControl>
              <Button variant="outlined" sx={{ marginTop: "1rem" }} type="submit">
                Invite
              </Button>
            </Stack>
          </form>
        )}
      </Stack>
    </Popover>
  );
}
