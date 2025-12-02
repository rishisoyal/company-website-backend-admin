'use client'
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

export default function AnalyticsTable({
  title,
  columns,
  data,
}: {
  title: string;
  columns: string[];
  data: any;
}) {
  const header = (
    <div className="pt-4 pb-4 flex flex-wrap align-items-center justify-content-between gap-2">
      <span className="text-xl text-900 font-bold">{title}</span>
    </div>
  );

  return (
    <div className="card bg-[#181825] rounded-xl text-white p-6 w-full">
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
