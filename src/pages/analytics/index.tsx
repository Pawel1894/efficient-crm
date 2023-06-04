import { api } from "@/utils/api";
import { Box, Breadcrumbs, Stack, Typography, useMediaQuery } from "@mui/material";
import React, { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Line,
  ComposedChart,
  type TooltipProps,
} from "recharts";
import { grey } from "@mui/material/colors";
import Head from "next/head";
import { useSystemStore } from "../_app";
export default function Page() {
  const desktopbr = useMediaQuery("(min-width:600px)");
  const { data: valuesPerStage } = api.analytics.valuesByStage.useQuery();
  const { data: statusesGroup } = api.analytics.groupedByStatus.useQuery();
  const { data: valuePerMonth } = api.analytics.valuesThisYear.useQuery();
  const setBreadcrumbs = useSystemStore((state) => state.setBreadcrumbs);

  function CustomTooltip({ payload, label, active }: TooltipProps<string, string | number>) {
    if (active && payload) {
      return (
        <Box bgcolor={grey["600"]} px={2} py={0.5}>
          <Typography textTransform={"capitalize"}>{`${typeof label === "string" ? label : ""} : ${
            payload[0]?.value ? payload[0]?.value : ""
          }`}</Typography>
        </Box>
      );
    }

    return null;
  }

  useEffect(() => {
    setBreadcrumbs(
      <Breadcrumbs aria-label="breadcrumb">
        <Typography color="text.primary">Analytics</Typography>
      </Breadcrumbs>
    );
  }, [setBreadcrumbs]);

  function ComplexTooltip({ payload, label, active }: TooltipProps<string, string | number>) {
    if (active && payload) {
      return (
        <Box bgcolor={grey["600"]} px={2} py={0.5}>
          <Typography textTransform={"capitalize"}>{label}</Typography>
          {payload.length > 0
            ? payload.map((item) => {
                if (typeof item.value === "number") {
                  return (
                    <Typography key={item.name}>{`${item.name ? item.name : ""} : ${
                      item.value ? "$ " + new Intl.NumberFormat("en").format(Number(item.value)) : "$ 0"
                    }`}</Typography>
                  );
                } else {
                  return (
                    <Typography key={item.name}>{`${item.name ? item.name : ""} : ${
                      item.value ? item.value : "---"
                    }`}</Typography>
                  );
                }
              })
            : null}
        </Box>
      );
    }
    return null;
  }

  return (
    <>
      <Head>
        <title>Analytics</title>
      </Head>
      <Stack
        width={"100%"}
        height={!desktopbr ? "auto" : "40vh"}
        flexDirection={"row"}
        sx={{
          flexDirection: {
            xs: "column",
            md: "row",
          },
        }}
      >
        <div
          style={{
            width: !desktopbr ? "100%" : 0,
            flex: !desktopbr ? "unset" : 1,
            height: !desktopbr ? "400px" : "auto",
          }}
        >
          <Typography>Deal values grouped by stages</Typography>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={valuesPerStage}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Stage" />
              <YAxis />
              <Tooltip content={ComplexTooltip} cursor={{ fill: "#80808074" }} />
              <Legend />
              <Bar dataKey="Forecast value" stackId="a" fill="#8884d8" />
              <Bar dataKey="Final value" stackId="a" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div
          style={{
            width: !desktopbr ? "100%" : 0,
            flex: !desktopbr ? "unset" : 1,
            height: !desktopbr ? "400px" : "auto",
            marginTop: !desktopbr ? "3rem" : "0",
          }}
        >
          <Typography>Count of leads by status</Typography>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={300}
              data={statusesGroup}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="Name" />
              <YAxis />
              <Tooltip cursor={{ fill: "#80808074" }} content={CustomTooltip} />
              <Legend />
              <Bar name="Status" dataKey="statuses" stackId="a" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Stack>
      <Box marginTop={4} height={"40vh"} width={"100%"}>
        <Typography>Current year deals</Typography>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={valuePerMonth}
            margin={{
              top: 20,
              right: 20,
              bottom: 20,
              left: 20,
            }}
          >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="Month" scale="band" />
            <YAxis />
            <Tooltip content={ComplexTooltip} cursor={{ fill: "#80808074" }} />
            <Legend />
            <Bar dataKey="Deals" barSize={4000} fill="#413ea0" />
            <Line type="monotone" dataKey="Final value" stroke="#ff7300" />
            <Line type="monotone" dataKey="Forecast value" stroke="green" />
          </ComposedChart>
        </ResponsiveContainer>
      </Box>
    </>
  );
}
