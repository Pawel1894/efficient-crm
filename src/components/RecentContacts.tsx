import { api } from "@/utils/api";
import { Paper } from "@mui/material";
import React from "react";
import RecentlyUpdated from "./RecentlyUpdated";
import { useOrganization } from "@clerk/nextjs";

export default function RecentContacts() {
  const { organization } = useOrganization();
  const { data: recentContacts } = api.contact.recentlyUpdated.useQuery(organization?.id, {
    refetchInterval: 5000,
  });

  return (
    <Paper>
      <RecentlyUpdated title="Recently updated contacts" data={recentContacts} />
    </Paper>
  );
}
