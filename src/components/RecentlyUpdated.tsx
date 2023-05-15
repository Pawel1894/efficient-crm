import { useOrganization, useOrganizationList, useUser } from "@clerk/nextjs";
import { Box, Button, Grid, Link, List, ListItemText, Typography } from "@mui/material";
import type { Contact, Lead } from "@prisma/client";
import React from "react";
import dayjs from "dayjs";

export default function RecentlyUpdated({
  data,
  title,
}: {
  data?: Array<Partial<Contact | Lead>>;
  title: string;
}) {
  // TODO: LIST items with links
  const { organization, membershipList } = useOrganization({
    membershipList: {},
  });

  function getMemberById(userId: string) {
    if (membershipList) {
      const user = membershipList.find((user) => user.publicUserData.userId === userId);

      return user ? (
        <Link href={`/user/${user.publicUserData.userId!}`}>{`${user.publicUserData.firstName ?? ""} ${
          user.publicUserData.lastName ?? ""
        }`}</Link>
      ) : (
        "Not found"
      );
    }

    return "Not found";
  }

  return (
    <Box p={2}>
      <Typography component={"span"}>{title}</Typography>
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
                  <Grid container>
                    <Grid xs={3}>
                      <Typography component="span" variant="body2" color="text.primary">
                        Name
                      </Typography>
                      <br />
                      <Typography component="span" variant="body1" color="text.primary">
                        {`${item.firstName ?? ""} ${item.lastName ?? ""}`}
                      </Typography>
                    </Grid>
                    <Grid xs={3}>
                      <Typography component="span" variant="body2" color="text.primary">
                        Owner
                      </Typography>
                      <br />
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body1"
                        color="text.primary"
                      >
                        {item.owner ? getMemberById(item.owner) : "None"}
                      </Typography>
                    </Grid>
                    <Grid xs={3}>
                      <Typography component="span" variant="body2" color="text.primary">
                        Updated by
                      </Typography>
                      <br />
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body1"
                        color="text.primary"
                      >
                        {item.updatedBy ? getMemberById(item.updatedBy) : "None"}
                      </Typography>
                    </Grid>
                    <Grid xs={3}>
                      <Typography component="span" variant="body2" color="text.primary">
                        Updated at
                      </Typography>
                      <br />
                      <Typography
                        sx={{ display: "inline" }}
                        component="span"
                        variant="body1"
                        color="text.primary"
                      >
                        {dayjs(item.updatedAt?.toString()).format("DD/MM/YYYY HH:mm:ss")}
                      </Typography>
                    </Grid>
                  </Grid>
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
