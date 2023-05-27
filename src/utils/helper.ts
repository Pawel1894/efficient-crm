import { organizations } from "@clerk/nextjs/api";

export async function getUser(orgId: string, userId: string) {
  const members = await organizations.getOrganizationMembershipList({
    organizationId: orgId,
  });
  return members.find((u) => u.publicUserData?.userId === userId);
}

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<T, Exclude<keyof T, Keys>> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];
