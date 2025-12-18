"use client";
import { TextData } from "@/types/content.types";
import { MRT_ColumnDef } from "material-react-table";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import DataTable from "./DataTable";
import Popup from "./PopUp";
import TextForm from "./TextForm";

type Props = {
  data: TextData[];
  page: string;
  /**
   * Callback function to fetch updated data
   */
  refreshData: () => void;
};

const TextDataTable = ({ data, page, refreshData }: Props) => {
  const [updateIndex, setUpdateIndex] = useState(0);
  const [updateMode, setUpdateMode] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TextData | null>(null);

  useEffect(() => {
    setUpdateMode(false);
    setSelectedRow(null);
  }, [page]);

  const handleUpdate = (row: TextData) => {
    setSelectedRow(row);
    setUpdateMode(true);
  };

  const columns: MRT_ColumnDef<TextData>[] = [
    { accessorKey: "block_type", header: "Block Type" },
    { accessorKey: "title", header: "Title" },
    { accessorKey: "subtitle", header: "Subtitle" },
    { accessorKey: "text", header: "Text" },
    {
      header: "Actions",
      Cell: ({ row }) => (
        <div className="flex gap-2">
          <button
            onClick={() => handleUpdate(row.original)}
            className="p-2 bg-blue-500 text-white rounded-md text-[24px]"
          >
            <FaRegEdit />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={data ?? []} />
      {updateMode && selectedRow && (
        <Popup isOpen={updateMode} onClose={() => setUpdateMode(false)}>
          <TextForm data={selectedRow} page={page} refreshData={refreshData} />
        </Popup>
      )}
    </>
  );
};

export default TextDataTable;
