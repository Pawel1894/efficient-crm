import { Box, List, ListItem, ListItemButton, ListItemText, Popover } from "@mui/material";
import { Dictionary } from "@prisma/client";
import React from "react";

type Props = {
  data: Dictionary[];
  onClickHandler: (item: Dictionary) => void;
  itemRef: React.RefObject<HTMLButtonElement>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
};

export default function DictionaryPopover({ itemRef, data, onClickHandler, setOpen, open }: Props) {
  return (
    <Popover
      open={open}
      anchorEl={itemRef.current}
      onClose={() => setOpen(false)}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
    >
      <List
        sx={{
          width: 150,
          maxHeight: 300,
          position: "relative",
          overflow: "auto",
        }}
      >
        {data.map((item) => (
          <ListItem key={item.id} disablePadding>
            <ListItemButton onClick={() => onClickHandler(item)}>
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Popover>
  );
}
