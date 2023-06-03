import type { OrganizationResource, OrganizationMembershipResource } from "@clerk/types";
import type { OrganizationMembershipRole } from "@clerk/nextjs/server";
import { toast } from "react-toastify";

export function formatToThousands(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

export async function removeMember(
  userId: string | null | undefined,
  organization: OrganizationResource | undefined | null,
  callback: () => Promise<void>,
  member: OrganizationMembershipResource | undefined
) {
  console.log("member", organization);
  if (!member || member.publicUserData.userId === userId) return;
  if (member.publicUserData.userId) {
    console.log("tst");
    try {
      await organization?.removeMember(member.publicUserData.userId);
      await callback();
    } catch (error) {
      const err = error as {
        errors: Array<{ message: string }>;
      };
      toast.error(err?.errors[0]?.message);
    }
  }
}

export async function updateRole(
  userId: string | null | undefined,
  organization: OrganizationResource | undefined | null,
  callback: () => Promise<void>,
  role: OrganizationMembershipRole
) {
  if (!userId) return;
  try {
    await organization?.updateMember({
      role,
      userId,
    });
    await callback();
  } catch (error) {
    const err = error as {
      errors: Array<{ message: string }>;
    };
    toast.error(err?.errors[0]?.message);
  }
}
