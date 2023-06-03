import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { AttachMoney, LocalActivity, ModeStandby } from "@mui/icons-material";
import React from "react";
import { grey } from "@mui/material/colors";

export default function Glossary() {
  return (
    <Box height={"256px"} p={2}>
      <Typography component={"span"}>Glossary</Typography>
      <List sx={{ paddingBottom: 0 }}>
        <ListItem sx={{ paddingLeft: 0 }}>
          <ListItemAvatar sx={{ minWidth: "auto", marginRight: "0.75rem" }}>
            <Avatar
              sx={{ backgroundColor: "transparent", color: grey["300"], width: "auto", height: "auto" }}
            >
              <ModeStandby />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <Box display={"flex"}>
              <Typography variant="body1">Lead – potential buyer.</Typography>
            </Box>
          </ListItemText>
        </ListItem>
        <ListItem sx={{ paddingLeft: 0 }}>
          <ListItemAvatar sx={{ minWidth: "auto", marginRight: "0.75rem" }}>
            <Avatar
              sx={{ backgroundColor: "transparent", color: grey["300"], width: "auto", height: "auto" }}
            >
              <AttachMoney />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <Box display={"flex"}>
              <Typography variant="body1">Deal – offert made to a lead.</Typography>
            </Box>
          </ListItemText>
        </ListItem>
        <ListItem sx={{ paddingLeft: 0 }}>
          <ListItemAvatar sx={{ minWidth: "auto", marginRight: "0.75rem" }}>
            <Avatar
              sx={{ backgroundColor: "transparent", color: grey["300"], width: "auto", height: "auto" }}
            >
              <LocalActivity />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <Box display={"flex"}>
              <Typography variant="body1">Activity – event that can be attached to a lead.</Typography>
            </Box>
          </ListItemText>
        </ListItem>
      </List>
    </Box>
  );
}
