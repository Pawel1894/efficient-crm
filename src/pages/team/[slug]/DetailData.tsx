import ItemDisplay from "@/components/ItemDisplay";
import { api } from "@/utils/api";
import { useOrganization } from "@clerk/nextjs";
import type { OrganizationMembershipResource } from "@clerk/types";
import type { OrganizationMembershipRole, User } from "@clerk/nextjs/server";
import { Box, Grid, Stack, MenuItem, Select, Typography } from "@mui/material";
import Image from "next/image";
import React, { useMemo } from "react";
import { toast } from "react-toastify";

type Props = {
  user: User;
  membership: OrganizationMembershipResource | undefined;
};

export default function DetailData({ user, membership }: Props) {
  const primaryMail = user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress;
  const { organization, membership: currentUser } = useOrganization({
    membershipList: {},
  });
  const context = api.useContext();

  async function updateRole(userId: string, role: OrganizationMembershipRole) {
    try {
      await organization?.updateMember({
        role,
        userId,
      });
      await context.user.get.invalidate(user.id);
    } catch (error) {
      const err = error as {
        errors: Array<{ message: string }>;
      };
      toast.error(err?.errors[0]?.message);
    }
  }

  return membership ? (
    <Grid py={3} item container columnGap={6} rowGap={4}>
      <Grid xs={5} md={3} lg={2} item>
        <ItemDisplay label="First name" content={user.firstName} />
      </Grid>
      <Grid xs={5} md={3} lg={2} item>
        <ItemDisplay label="Last name" content={user.lastName} />
      </Grid>
      <Grid xs={5} md={3} lg={2} item>
        <ItemDisplay
          label="Email"
          href={primaryMail ? `mailto:${primaryMail}` : null}
          content={primaryMail}
        />
      </Grid>
      <Grid xs={5} md={3} lg={2} item>
        <ItemDisplay
          label="Phone"
          content={user.phoneNumbers.find((e) => e.id === user.primaryPhoneNumberId)?.phoneNumber}
        />
      </Grid>
      <Grid xs={5} md={3} lg={2} item>
        <ItemDisplay label="2fa enabled" content={user.twoFactorEnabled === true ? "Yes" : "No"} />
      </Grid>
      <Grid xs={5} md={3} lg={2} item>
        {membership && currentUser?.role === "admin" ? (
          <Stack>
            <Typography variant="overline" component={"span"}>
              Role
            </Typography>
            <Select
              sx={{
                height: "2rem",
              }}
              value={membership.role}
              onChange={(e) => void updateRole(user.id, e.target.value as OrganizationMembershipRole)}
            >
              <MenuItem key={"role_admin"} value={"admin"}>
                Admin
              </MenuItem>
              <MenuItem key={"role_basic_member"} value={"basic_member"}>
                Basic Member
              </MenuItem>
            </Select>
          </Stack>
        ) : (
          <ItemDisplay label="Role" content={membership?.role} />
        )}
      </Grid>
      <Grid xs={5} md={3} lg={2} item>
        <ItemDisplay label="Identifier" content={membership?.publicUserData.identifier} />
      </Grid>
    </Grid>
  ) : (
    <Typography>Member not found</Typography>
  );
}
