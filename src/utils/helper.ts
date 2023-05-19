import { organizations } from "@clerk/nextjs/api";

export async function getUser(orgId: string, userId: string) {
  const members = await organizations.getOrganizationMembershipList({
    organizationId: orgId,
  });
  return members.find((u) => u.publicUserData?.userId === userId);
}
