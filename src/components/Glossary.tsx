import { Avatar, Box, List, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { AttachMoney, ContactPage, LocalActivity, ModeStandby } from "@mui/icons-material";
import React from "react";

export default function Glossary() {
  return (
    <Box p={2}>
      <Typography>Glossary</Typography>
      <List>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <ContactPage />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <Box display={"flex"}>
              <Typography fontWeight={700} component={"span"} variant="body1">
                Contact -{" "}
              </Typography>{" "}
              <Typography>{"\b"} it is a client with closed deal/contract</Typography>
            </Box>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <ModeStandby />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <Box display={"flex"}>
              <Typography fontWeight={700} component={"span"} variant="body1">
                Lead -{" "}
              </Typography>
              <Typography>{"\b"} potential client</Typography>
            </Box>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <AttachMoney />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <Box display={"flex"}>
              <Typography fontWeight={700} component={"span"} variant="body1">
                Deal -{" "}
              </Typography>
              <Typography>{"\b"} forecast offert made for lead</Typography>
            </Box>
          </ListItemText>
        </ListItem>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <LocalActivity />
            </Avatar>
          </ListItemAvatar>
          <ListItemText>
            <Box display={"flex"}>
              <Typography fontWeight={700} component={"span"} variant="body1">
                Activity -{" "}
              </Typography>
              <Typography component={"span"} variant="body1">
                {"\b"} event which can be made for either client or lead
              </Typography>
            </Box>
          </ListItemText>
        </ListItem>
      </List>
    </Box>
  );
}
