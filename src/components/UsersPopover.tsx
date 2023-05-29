import useDebounce from "@/hooks/useDebounced";
import { useOrganization } from "@clerk/nextjs";
import { List, ListItem, ListItemButton, ListItemText, Popover, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

type Props = {
  onClickHandler: (item: { id: string; fullname: string }) => void;
  itemRef: React.RefObject<HTMLButtonElement>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
};

export default function OwnerPopover({ itemRef, onClickHandler, setOpen, open }: Props) {
  const { membershipList } = useOrganization({
    membershipList: {},
  });
  const [members, setMembers] = useState(membershipList);
  const filteredMembers = useDebounce(members, 300);

  function onSearchHandler(event: React.KeyboardEvent<HTMLInputElement>) {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    if (!value) {
      setMembers(membershipList);
      return;
    }

    const newMembers = membershipList?.filter(
      (user) =>
        user.publicUserData.identifier?.includes(value) ||
        user.publicUserData.firstName?.includes(value) ||
        user.publicUserData.lastName?.includes(value) ||
        user.publicUserData.userId?.includes(value)
    );

    setMembers(newMembers);
  }

  useEffect(() => {
    setMembers(membershipList);
  }, [membershipList]);

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
      <TextField fullWidth placeholder="Search for user" onKeyUp={onSearchHandler} />
      <List
        sx={{
          width: 350,
          maxHeight: 500,
          position: "relative",
          overflow: "auto",
        }}
      >
        {filteredMembers && filteredMembers.length > 0 ? (
          filteredMembers.map((item) => (
            <ListItem key={item.publicUserData.userId} disablePadding>
              <ListItemButton
                onClick={() =>
                  onClickHandler({
                    id: item.publicUserData.userId as string,
                    fullname: item.publicUserData.identifier,
                  })
                }
              >
                <ListItemText
                  title={item.publicUserData.identifier}
                  primary={item.publicUserData.identifier}
                />
              </ListItemButton>
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary={"0 user's found"} />
          </ListItem>
        )}
      </List>
    </Popover>
  );
}
