import { api } from "@/utils/api";
import { Paper } from "@mui/material";
import React from "react";
import RecentlyUpdated from "./RecentlyUpdated";
import { useOrganization } from "@clerk/nextjs";

export default function RecentLeads() {
  const { organization } = useOrganization();
  const { data: recentLeads } = api.lead.recentlyUpdated.useQuery(organization?.id, {
    refetchInterval: 10000,
  });

  return (
    <Paper>
      <RecentlyUpdated pathname="/lead" title="Recently updated leads" data={recentLeads} />
    </Paper>
  );
}
