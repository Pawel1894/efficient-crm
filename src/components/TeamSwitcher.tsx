import { api } from "@/utils/api";
import { useOrganization, useOrganizationList, useUser } from "@clerk/nextjs";
import { FormControl, MenuItem, Select, Typography } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

export default function TeamSwitcher() {
  const { user, isSignedIn } = useUser();
  const { setActive, organizationList, isLoaded, createOrganization } = useOrganizationList();
  const { organization, isLoaded: isLoadedOrganization } = useOrganization();
  const { data: userSettings, isSuccess } = api.user.settings.useQuery(undefined);
  const { mutate: setSettings } = api.user.setSettings.useMutation();
  const { mutate: coldStart } = api.system.coldStart.useMutation();
  const [currentOrg, setCurrentOrg] = useState<string | null>(null);
  const context = api.useContext();
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    handleInit();
  }, [isLoaded, isSignedIn, isSuccess, isLoadedOrganization]);

  async function handleOrgChange(organization: string | null) {
    if (setActive && organization) {
      try {
        await setActive({ organization });
      } catch (error) {
        const err = error as {
          errors: Array<{ message: string }>;
        };
        toast.error(err?.errors[0]?.message);
      }

      setSettings(organization);
      await context.invalidate();
      setCurrentOrg(organization);
    }
  }

  useEffect(() => {
    setCurrentOrg(organization ? organization.id : null);
  }, [organization?.id]);

  async function handleInit() {
    if (isLoaded && isSignedIn && isSuccess) {
      try {
        if (organizationList.length === 0 && !userSettings?.lastActiveOrg) {
          const orgName = user?.firstName ? `${user.firstName}'s team` : "first team";
          const organization = await createOrganization({ name: orgName });
          setSettings(organization.id);
          coldStart({
            id: organization.id,
            name: organization.name,
            userName: `${user.firstName ?? ""} ${user.lastName ?? ""}`,
          });
          await setActive({ organization: organization.id });
        } else {
          const lastOrg = organizationList.find((org) => org.organization.id === userSettings?.lastActiveOrg);

          if (lastOrg) {
            await setActive({ organization: lastOrg.organization.id });
          } else if (organizationList.length > 0 && organizationList[0]) {
            await setActive({
              organization: organizationList[0].organization.id,
            });
            setSettings(organizationList[0].organization.id);
          }
        }
      } catch (error) {
        const err = error as {
          errors: Array<{ message: string }>;
        };
        toast.error(err?.errors[0]?.message);
      }
    }
  }

  return organizationList && organizationList?.length > 0 ? (
    <Box
      sx={{
        width: "10rem",
      }}
    >
      <FormControl fullWidth>
        <Typography variant="subtitle2">Active Team</Typography>
        <Select
          sx={{
            height: "2rem",
          }}
          value={currentOrg}
          onChange={(e) => void handleOrgChange(e.target.value)}
        >
          {organizationList.map((org) => {
            return (
              <MenuItem key={org.organization.id} value={org.organization.id}>
                {org.organization.name}
              </MenuItem>
            );
          })}
        </Select>
      </FormControl>
    </Box>
  ) : null;
}
