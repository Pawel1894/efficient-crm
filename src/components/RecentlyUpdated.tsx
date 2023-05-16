import { useOrganization, useOrganizationList, useUser } from "@clerk/nextjs";
import { Box, Divider, IconButton, Link, List, ListItemText, Typography } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2"; // Grid version 2
import type { Contact, Lead } from "@prisma/client";
import React from "react";
import dayjs from "dayjs";
import { Visibility } from "@mui/icons-material";

export default function RecentlyUpdated({
  data,
  title,
  pathname,
}: {
  data?: Array<Partial<Contact | Lead>>;
  title: string;
  pathname: string;
}) {
  const { membershipList } = useOrganization({
    membershipList: {},
  });

  function getMemberById(userId: string) {
    if (membershipList) {
      const user = membershipList.find((user) => user.publicUserData.userId === userId);

      return user ? (
        <Link color={"text.primary"} href={`/user/${user.publicUserData.userId!}`}>{`${
          user.publicUserData.firstName ?? ""
        } ${user.publicUserData.lastName ?? ""}`}</Link>
      ) : (
        "Not found"
      );
    }

    return "Not found";
  }

  return (
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
                    <Grid container columns={13}>
                      <Grid xs={3}>
                        <Typography color={"primary.dark"} component="span" variant="caption">
                          Name
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          {`${item.firstName ?? ""} ${item.lastName ?? ""}`}
                        </Typography>
                      </Grid>
                      <Grid xs={3}>
                        <Typography color={"primary.dark"} component="span" variant="caption">
                          Owner
                        </Typography>
                        <br />
                        <Typography component="span" variant="body2">
                          {item.owner ? getMemberById(item.owner) : "None"}
                        </Typography>
                      </Grid>
                      <Grid xs={3}>
                        <Typography color={"primary.dark"} component="span" variant="caption">
                          Updated by
                        </Typography>
                        <br />
                        <Typography sx={{ display: "inline" }} component="span" variant="body2">
                          {item.updatedBy ? getMemberById(item.updatedBy) : "None"}
                        </Typography>
                      </Grid>
                      <Grid xs={3}>
                        <Typography color={"primary.dark"} component="span" variant="caption">
                          Updated at
                        </Typography>
                        <br />
                        <Typography sx={{ display: "inline" }} component="span" variant="body2">
                          {dayjs(item.updatedAt?.toString()).format("DD/MM/YYYY HH:mm:ss")}
                        </Typography>
                      </Grid>
                      <Grid xs={1}>
                        {item.id ? (
                          <IconButton href={`${pathname}/${item.id}`} title="View">
                            <Visibility />
                          </IconButton>
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
