import { api } from "@/utils/api";
import { Paper } from "@mui/material";
import React from "react";
import RecentlyUpdated from "./RecentlyUpdated";

export default function RecentContacts() {
  const { data: recentContacts } = api.contact.recentlyUpdated.useQuery(undefined, {
    refetchInterval: 10000,
  });

  return (
    <Paper>
      <RecentlyUpdated pathname="/contact" title="Recently updated contacts" data={recentContacts} />
    </Paper>
  );
}
