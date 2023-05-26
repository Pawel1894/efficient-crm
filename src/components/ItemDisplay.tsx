import { Stack, Typography } from "@mui/material";
import Link from "next/link";
import React from "react";

type Props = {
  content: string | null | undefined;
  label: string;
  href?: string | null;
};

export default function ItemDisplay({ content, label, href }: Props) {
  return (
    <Stack>
      <Typography variant="overline" component={"span"}>
        {label}
      </Typography>
      {href && content ? (
        <Link href={href}>
          <Typography
            sx={{
              textOverflow: "ellipsis",
              overflow: "hidden",
            }}
            color="text.primary"
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
