"use client";

import { BarChart } from "@mui/x-charts/BarChart";

type Props = {
  xAxis: { data: string[]; label: string }[];
  yAxis: { data: number[] }[];
};

export default function BChart({ xAxis, yAxis }: Props) {
  return <BarChart xAxis={xAxis} series={yAxis} height={300} />;
}
