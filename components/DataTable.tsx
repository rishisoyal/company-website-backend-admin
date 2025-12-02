"use client";
import { MaterialReactTable, type MRT_ColumnDef } from "material-react-table";

type Props = {
  columns: MRT_ColumnDef<any>[];
  data: any[];
};

export default function DataTable({ columns, data }: Props) {
  return (
    <MaterialReactTable
      columns={columns}
      data={data}
      enableColumnResizing
      enableStickyHeader
      layoutMode="grid" // responsive table
      enableHiding // allows auto-hide on smaller screens
      enableDensityToggle={false}
      enableFullScreenToggle={false}
      muiTableContainerProps={{
        sx: {
          maxHeight: "calc(100vh - 200px)",
          overflowX: "auto",
        },
      }}
      initialState={{
        density: "comfortable",
        columnVisibility: {
          content: false, // hide large columns on mobile by default
        },
      }}
      muiTableBodyCellProps={{
        sx: {
          wordBreak: "break-word",
          whiteSpace: "normal",
        },
      }}
    />
  );
}
