import { MoreVert } from "@mui/icons-material";
import { Box, ClickAwayListener, IconButton, Stack, useMediaQuery } from "@mui/material";
import React, { useState } from "react";
import { grey } from "@mui/material/colors";

type Props = {
  children: JSX.Element[];
  padding?: `${number}rem`;
};

export default function AdaptiveHeader({ children, padding }: Props) {
  const desktopbr = useMediaQuery("(min-width:600px)");
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box
      sx={{
        marginLeft: {
          xs: "auto",
          sm: "unset",
        },
      }}
      position={"relative"}
    >
      <IconButton
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
        }}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <MoreVert />
      </IconButton>

      <>
        {isOpen || desktopbr ? (
          <ClickAwayListener onClickAway={() => setIsOpen(false)}>
            <Stack
              gap={2}
              sx={{
                padding: padding ?? "1rem",
                flexDirection: {
                  xs: "column",
                  sm: "row",
                },
                position: {
                  xs: "absolute",
                  sm: "static",
                },
                backgroundColor: {
                  xs: grey["900"],
                  sm: "transparent",
                },
                zIndex: 1,
                width: {
                  xs: "250px",
                  sm: "auto",
                },
                right: "100%",
              }}
            >
              {children}
            </Stack>
          </ClickAwayListener>
        ) : null}
      </>
    </Box>
  );
}
