import { api } from "@/utils/api";
import { useOrganization, useOrganizationList, useUser } from "@clerk/nextjs";
import React, { useEffect } from "react";

export default function TeamSwitcher() {
  const { user, isSignedIn } = useUser();
  const { setActive, organizationList, isLoaded, createOrganization } = useOrganizationList();
  const { organization, ...rest } = useOrganization();
  const { data: userSettings, isSuccess } = api.user.settings.useQuery(undefined, {
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const { mutate: setSettings } = api.user.setSettings.useMutation();

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-floating-promises
    handleInit();
  }, [isLoaded, isSignedIn, isSuccess]);

  async function handleInit() {
    if (isLoaded && isSignedIn && isSuccess) {
      if (organizationList.length === 0 && !userSettings?.lastActiveOrg) {
        const orgName = user?.firstName ? `${user.firstName}'s team` : "first team";
        const organization = await createOrganization({ name: orgName });
        await setActive({ organization });
        setSettings(organization.id);
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

  return <div>{organization?.name}</div>;
}
