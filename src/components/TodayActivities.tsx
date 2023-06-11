import { api } from "@/utils/api";
import { Visibility } from "@mui/icons-material";
import { Box, Divider, IconButton, List, ListItemText, Skeleton, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import dayjs from "dayjs";
import Link from "next/link";
import React from "react";

export default function TodayActivities() {
  const { data, isLoading } = api.activity.today.useQuery();
  return isLoading ? (
    <Box height={256}>
      <Skeleton
        sx={{ borderRadius: "0.3rem" }}
        animation="wave"
        variant="rectangular"
        width="100%"
        height="100%"
      />
    </Box>
  ) : (
    <Box p={2} height={256}>
      <Typography>Today&apos;s activities</Typography>
      <List style={{ height: "85%", overflowY: "auto", overflowX: "hidden" }}>
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
                      <Grid xs={6} md={3}>
                        <Typography color={"primary.dark"} component="span" variant="caption">
                          Title
                        </Typography>
                        <br />
                        <Typography
                          textOverflow={"ellipsis"}
                          overflow={"hidden"}
                          whiteSpace={"nowrap"}
                          width={"100%"}
                          display={"inline-block"}
                          p={0}
                          m={0}
                          component="span"
                          variant="body2"
                        >
                          {`${item.title ?? ""}`}
                        </Typography>
                      </Grid>
                      <Grid xs={6} md={3}>
                        <Typography color={"primary.dark"} component="span" variant="caption">
                          Status
                        </Typography>
                        <br />
                        <Typography
                          textOverflow={"ellipsis"}
                          overflow={"hidden"}
                          whiteSpace={"nowrap"}
                          width={"100%"}
                          display={"inline-block"}
                          p={0}
                          m={0}
                          component="span"
                          variant="body2"
                        >
                          {`${item.status?.label ?? "None"}`}
                        </Typography>
                      </Grid>
                      <Grid xs={6} md={3}>
                        <Typography color={"primary.dark"} component="span" variant="caption">
                          Date
                        </Typography>
                        <br />
                        <Typography
                          textOverflow={"ellipsis"}
                          overflow={"hidden"}
                          whiteSpace={"nowrap"}
                          width={"100%"}
                          display={"inline-block"}
                          p={0}
                          m={0}
                          component="span"
                          variant="body2"
                        >
                          {`${dayjs(item.date?.toString()).format("DD/MM/YYYY HH:mm")}`}
                        </Typography>
                      </Grid>
                      <Grid xs={5} md={3}>
                        <Typography color={"primary.dark"} component="span" variant="caption">
                          Lead
                        </Typography>
                        <br />

                        {item.lead ? (
                          <Link style={{ textDecoration: "unset" }} href={`/lead/${item.lead.id}`}>
                            <Typography
                              textOverflow={"ellipsis"}
                              overflow={"hidden"}
                              whiteSpace={"nowrap"}
                              width={"100%"}
                              display={"inline-block"}
                              p={0}
                              m={0}
                              sx={{
                                textDecoration: "underline",
                              }}
                              color="primary.main"
                              component="span"
                              variant="body2"
                            >
                              {`${item.lead.firstName} ${item.lead.lastName}`}{" "}
                            </Typography>
                          </Link>
                        ) : (
                          <Typography color={"text.primary"} component="span" variant="body2">
                            None
                          </Typography>
                        )}
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
