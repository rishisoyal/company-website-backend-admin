"use client";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { BarChart } from "@mui/x-charts/BarChart";

type CardProps = {
  title: string;
  data: string;
};

export function AnalyticsCard({ title, data }: CardProps) {
  return (
    <>
      <div className="card bg-[#181825] border-4 border-black text-2xl rounded-xl min-w-40 w-full p-6">
        <h2 className="text-white">{title}</h2>
        <p className="text-white">{data}</p>
      </div>
    </>
  );
}

type BChartProps = {
  xAxis: { data: string[]; label: string }[];
  yAxis: { data: number[] }[];
};

export function AnalyticsBChart({ xAxis, yAxis }: BChartProps) {
  return <BarChart xAxis={xAxis} series={yAxis} height={300} />;
}

type TableProps = {
  title: string;
  columns: string[];
  data: any;
};

export function AnalyticsTable({ title, columns, data }: TableProps) {
  const header = (
    <div className="pt-4 pb-4 flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">{title}</span>
    </div>
  );

  return (
    <div className="card bg-[#181825] border-4 border-black rounded-xl text-white p-6 w-full">
      <DataTable
        value={data}
        header={header}
        // tableStyle={{ minWidth: "30rem" }}
      >
        {columns.map((c, i) => (
          <Column key={i} field={c} header={c}></Column>
        ))}
      </DataTable>
    </div>
  );
}
