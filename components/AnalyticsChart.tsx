'use client'

import { BarChart } from "@mui/x-charts/BarChart";

export default function BChart({
  xAxis,
  yAxis,
}: {
  xAxis: { data: string[]; label: string }[];
  yAxis: { data: number[] }[];
}) {
  return <BarChart xAxis={xAxis} series={yAxis} height={300} />;
}
