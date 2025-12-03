"use client";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

type Props = {
  title: string;
  columns: string[];
  data: any;
};

export default function AnalyticsTable({ title, columns, data }: Props) {
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
          <Column field={c} header={c}></Column>
        ))}
      </DataTable>
    </div>
  );
}
