import { api } from "@/utils/api";
import { Paper } from "@mui/material";
import React from "react";
import RecentlyUpdated from "./RecentlyUpdated";

export default function RecentLeads() {
  const { data: recentLeads, isLoading } = api.lead.recentlyUpdated.useQuery(undefined, {
    refetchInterval: 10000,
  });

  return (
    <Paper>
      <RecentlyUpdated
        isLoading={isLoading}
        pathname="/lead"
        title="Recently updated leads"
        data={recentLeads}
      />
    </Paper>
  );
}
