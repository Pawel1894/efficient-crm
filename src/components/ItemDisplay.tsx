import { Box, Stack, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

type Props = {
  content: string | null | undefined;
  label: string;
  href?: string | null;
  tooltip?: JSX.Element;
};

export default function ItemDisplay({ content, label, href, tooltip }: Props) {
  return (
    <Stack>
      <Stack direction={"row"} gap={"0.25rem"}>
        <Typography variant="overline" component={"span"}>
          {label}
        </Typography>
        <Box>{tooltip}</Box>
      </Stack>
      {href && content ? (
        <Link style={{ textDecoration: "unset" }} href={href}>
          <Typography
            sx={{
              display: "block",
              textOverflow: "ellipsis",
              overflow: "hidden",
              textDecoration: "underline",
            }}
            color="primary.main"
            variant="h6"
            component={"span"}
          >
            {content}
          </Typography>
        </Link>
      ) : (
        <Typography
          sx={{
            textOverflow: "ellipsis",
            overflow: "hidden",
          }}
          variant="h6"
          component={"span"}
          title={content ? content : ""}
        >
          {content ? content : "---"}
        </Typography>
      )}
    </Stack>
  );
}
