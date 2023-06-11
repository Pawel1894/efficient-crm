import { Box, Divider, IconButton, List, ListItemText, Skeleton, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import type { Lead } from "@prisma/client";
import React from "react";
import dayjs from "dayjs";
import { Visibility } from "@mui/icons-material";
import Link from "next/link";

export default function RecentlyUpdated({
  data,
  title,
  pathname,
  isLoading,
}: {
  data?: Array<Partial<Lead>>;
  title: string;
  pathname: string;
  isLoading: boolean;
}) {
  return isLoading ? (
    <Box height={300}>
      <Skeleton animation="wave" variant="rectangular" width="100%" height="100%" />
    </Box>
  ) : (
    <Box p={2} position="relative">
      <Typography component={"span"}>{title}</Typography>
      <Box position={"absolute"} top={16} right={16}>
        <div title="data refreshing every 10 seconds" className="pulse"></div>
      </Box>
      <List>
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
                          Name
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
                          {`${item.firstName ?? ""} ${item.lastName ?? ""}`}
                        </Typography>
                      </Grid>
                      <Grid xs={6} md={3}>
                        <Typography color={"primary.dark"} component="span" variant="caption">
                          Owner
                        </Typography>
                        <br />
                        {item.ownerFullname?.trim() ? (
                          <Link style={{ textDecoration: "unset" }} href={`/team/${item.owner ?? ""}`}>
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
                              {item.ownerFullname}
                            </Typography>
                          </Link>
                        ) : (
                          <Typography color={"text.primary"} component="span" variant="body2">
                            None
                          </Typography>
                        )}
                      </Grid>
                      <Grid xs={6} md={3}>
                        <Typography color={"primary.dark"} component="span" variant="caption">
                          Updated by
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
                          {item.updatedBy?.trim() ? item.updatedBy : "None"}
                        </Typography>
                      </Grid>
                      <Grid xs={6} md={3}>
                        <Typography color={"primary.dark"} component="span" variant="caption">
                          Updated at
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
                          {dayjs(item.updatedAt?.toString()).format("DD/MM/YYYY HH:mm")}
                        </Typography>
                      </Grid>
                      <Grid xs={1}>
                        {item.id ? (
                          <Link href={`${pathname}/${item.id}`}>
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
          <span>No data</span>
        )}
      </List>
    </Box>
  );
}
