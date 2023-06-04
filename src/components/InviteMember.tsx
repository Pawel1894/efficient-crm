import { api } from "@/utils/api";
import { clerkClient, useOrganization } from "@clerk/nextjs";
import type { OrganizationMembershipRole } from "@clerk/nextjs/server";
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
} from "@mui/material";
import React, { type FormEvent, useState } from "react";
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
  const { mutate: inviteUser } = api.system.inviteMember.useMutation({
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function submit(e: FormEvent) {
    e.preventDefault();
    if (organization && email && role) {
      setIsLoading(true);
      try {
        inviteUser({
          emailAddress: email,
          role: role,
          organizationId: organization.id,
          redirectUrl: window.origin + "/auth/signup",
        });
        toast.success("Invite sent");
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
                  <FormControlLabel value="basic_member" control={<Radio />} label="Basic Member" />
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
