import { OrganizationResource, OrganizationMembershipResource } from "@clerk/types";
import { User } from "@clerk/nextjs/api";
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
