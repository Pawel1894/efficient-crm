import { api } from "@/utils/api";
import { useOrganization, useOrganizationList, useUser } from "@clerk/nextjs";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Box } from "@mui/system";
import React, { useEffect } from "react";

export default function TeamSwitcher() {
  const { user, isSignedIn } = useUser();
  const { setActive, organizationList, isLoaded, createOrganization } = useOrganizationList();
  const { organization, isLoaded: isLoadedOrganization } = useOrganization();
  const { data: userSettings, isSuccess } = api.user.settings.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const { mutate: setSettings } = api.user.setSettings.useMutation();
  const { mutate: coldStart } = api.system.coldStart.useMutation();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    handleInit();
  }, [isLoaded, isSignedIn, isSuccess, isLoadedOrganization]);

  async function handleOrgChange(organization: string) {
    if (setActive) await setActive({ organization });
    setSettings(organization);
  }

  async function handleInit() {
    if (isLoaded && isSignedIn && isSuccess) {
      if (organizationList.length === 0 && !userSettings?.lastActiveOrg) {
        const orgName = user?.firstName ? `${user.firstName}'s team` : "first team";
        const organization = await createOrganization({ name: orgName });
        await setActive({ organization });
        setSettings(organization.id);
        coldStart({
          id: organization.id,
          name: organization.name,
          userName: `${user.firstName ?? ""} ${user.lastName ?? ""}`,
        });
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
    }
  }

  return organizationList && organizationList?.length > 0 ? (
    <Box
      sx={{
        width: "10rem",
      }}
    >
      <FormControl fullWidth>
        <InputLabel id="org-select">Active team</InputLabel>
        <Select
          sx={{
            height: "2.5rem",
          }}
          labelId="org-select"
          value={organization?.id}
          label="Active team"
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
