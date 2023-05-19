import { api } from "@/utils/api";
import { useOrganization } from "@clerk/nextjs";
import { Visibility } from "@mui/icons-material";
import { Box, Divider, IconButton, List, ListItemText, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";

export default function IncomingActivities() {
  const { organization } = useOrganization();
  const { data } = api.activity.incoming.useQuery(organization?.id);
  return (
    <Box p={2} height={256}>
      <Typography>Incoming activities</Typography>
      <List style={{ height: "85%", overflow: "auto" }}>
        {data && data.length > 0 ? (
          data.map((item) => {
            return (
              <ListItemText
                sx={{
                  marginTop: "1rem",
                }}
                key={item.id}
                primary={
                  <>
                    <Grid alignItems={"center"} container columns={13}>
                      <Grid xs={3}>
                        <Typography color={"primary.dark"} component="span" variant="caption">
                          Title
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          {`${item.title ?? ""}`}
                        </Typography>
                      </Grid>
                      <Grid xs={3}>
                        <Typography color={"primary.dark"} component="span" variant="caption">
                          Status
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          {`${item.status?.label ?? "None"}`}
                        </Typography>
                      </Grid>
                      <Grid xs={3}>
                        <Typography color={"primary.dark"} component="span" variant="caption">
                          Date
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          {`${dayjs(item.date?.toString()).format("DD/MM/YYYY")} ${dayjs(
                            item.time?.toString()
                          ).format("HH:mm:ss")}`}
                        </Typography>
                      </Grid>
                      <Grid xs={3}>
                        <Typography color={"primary.dark"} component="span" variant="caption">
                          {item.contact ? "Contact" : "Lead"}
                        </Typography>
                        <br />

                        {item.contact ? (
                          <Link href={`/contact/${item.contact.id}`}>
                            <Typography color={"text.primary"} component="span" variant="body2">
                              {`${item.contact.firstName} ${item.contact.lastName}`}{" "}
                            </Typography>
                          </Link>
                        ) : null}

                        {item.lead ? (
                          <Link href={`/lead/${item.lead.id}`}>
                            <Typography color={"text.primary"} component="span" variant="body2">
                              {`${item.lead.firstName} ${item.lead.lastName}`}{" "}
                            </Typography>
                          </Link>
                        ) : null}

                        {!item.contact && !item.lead ? (
                          <Typography color={"text.primary"} component="span" variant="body2">
                            None
                          </Typography>
                        ) : null}
                      </Grid>
                      <Grid xs={1}>
                        {item.id ? (
                          <Link href={`activity/${item.id}`}>
                            <IconButton title="View">
                              <Visibility />
                            </IconButton>
                          </Link>
                        ) : null}
                      </Grid>
                    </Grid>
                    <Divider sx={{ marginTop: "1rem" }} />
                  </>
                }
              />
            );
          })
        ) : (
          <span>No activities coming soon</span>
        )}
      </List>
    </Box>
  );
}
