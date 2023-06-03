import { Grid, Skeleton } from "@mui/material";
import React from "react";

export default function SkeletonTemplate() {
  return (
    <Grid py={3} item container columnGap={6} rowGap={4}>
      <Grid xs={5} md={3} lg={2} item gap={2} container>
        <Skeleton variant="rectangular" width={210} height={30} />
        <Skeleton variant="rectangular" width={210} height={30} />
      </Grid>
      <Grid xs={5} md={3} lg={2} item container gap={2}>
        <Skeleton variant="rectangular" width={210} height={30} />
        <Skeleton variant="rectangular" width={210} height={30} />
      </Grid>
      <Grid xs={5} md={3} lg={2} item container gap={2}>
        <Skeleton variant="rectangular" width={210} height={30} />
        <Skeleton variant="rectangular" width={210} height={30} />
      </Grid>
      <Grid xs={5} md={3} lg={2} item container gap={2}>
        <Skeleton variant="rectangular" width={210} height={30} />
        <Skeleton variant="rectangular" width={210} height={30} />
      </Grid>
      <Grid xs={5} md={3} lg={2} item container gap={2}>
        <Skeleton variant="rectangular" width={210} height={30} />
        <Skeleton variant="rectangular" width={210} height={30} />
      </Grid>
      <Grid xs={5} md={3} lg={2} item container gap={2}>
        <Skeleton variant="rectangular" width={210} height={30} />
        <Skeleton variant="rectangular" width={210} height={30} />
      </Grid>
      <Grid xs={5} md={3} lg={2} item container gap={2}>
        <Skeleton variant="rectangular" width={210} height={30} />
        <Skeleton variant="rectangular" width={210} height={30} />
      </Grid>
    </Grid>
  );
}
