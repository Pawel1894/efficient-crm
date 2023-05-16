import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { AttachMoney, ContactPage, LocalActivity, ModeStandby } from "@mui/icons-material";
import React from "react";

export default function Glossary() {
  return (
    <Box p={2}>
      <Typography component={"span"}>Glossary</Typography>
      <List>
        <ListItem sx={{ paddingLeft: 0 }}>
          <ListItemAvatar sx={{ minWidth: "auto", marginRight: "1rem" }}>
            <Avatar
              sx={{
                backgroundColor: "transparent",
                color: "#fff",
                width: "max-content",
                height: "max-content",
              }}
            >
              <ContactPage />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <Box display={"flex"}>
              <Typography variant="body1">
                <Typography fontWeight={700} component={"span"}>
                  Contact -{" "}
                </Typography>{" "}
                {"\b"} it is a client with closed deal/contract
              </Typography>
            </Box>
          </ListItemText>
        </ListItem>
        <ListItem sx={{ paddingLeft: 0 }}>
          <ListItemAvatar sx={{ minWidth: "auto", marginRight: "1rem" }}>
            <Avatar sx={{ backgroundColor: "transparent", color: "#fff", width: "auto", height: "auto" }}>
              <ModeStandby />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <Box display={"flex"}>
              <Typography variant="body1">
                <Typography fontWeight={700} component={"span"}>
                  Lead -{" "}
                </Typography>
                {"\b"} potential client
              </Typography>
            </Box>
          </ListItemText>
        </ListItem>
        <ListItem sx={{ paddingLeft: 0 }}>
          <ListItemAvatar sx={{ minWidth: "auto", marginRight: "1rem" }}>
            <Avatar sx={{ backgroundColor: "transparent", color: "#fff", width: "auto", height: "auto" }}>
              <AttachMoney />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <Box display={"flex"}>
              <Typography variant="body1">
                <Typography fontWeight={700} component={"span"}>
                  Deal -{" "}
                </Typography>
                forecast offert made for lead
              </Typography>
            </Box>
          </ListItemText>
        </ListItem>
        <ListItem sx={{ paddingLeft: 0 }}>
          <ListItemAvatar sx={{ minWidth: "auto", marginRight: "1rem" }}>
            <Avatar sx={{ backgroundColor: "transparent", color: "#fff", width: "auto", height: "auto" }}>
              <LocalActivity />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <Box display={"flex"}>
              <Typography variant="body1">
                <Typography fontWeight={700} component={"span"}>
                  Activity -{" "}
                </Typography>
                {"\b"} event which can be made for either client or lead
              </Typography>
            </Box>
          </ListItemText>
        </ListItem>
      </List>
    </Box>
  );
}
