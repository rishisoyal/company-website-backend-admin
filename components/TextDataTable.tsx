"use client";
import { TextData } from "@/types/content.types";
import { MRT_ColumnDef } from "material-react-table";
import { useEffect, useState } from "react";
import DataTable from "./DataTable";
import Popup from "./PopUp";
import TextForm from "./TextForm";
import { FaRegEdit } from "react-icons/fa";

type Props = {
  data: TextData[];
  page: string
  /**
   * Callback function to fetch updated data
   */;
  refreshData: () => void;
};

const TextDataTable = ({ data, page, refreshData }: Props) => {
  const [updateIndex, setUpdateIndex] = useState(0);
  const [updateMode, setUpdateMode] = useState(false);

  useEffect(() => {
    setUpdateMode(false);
  }, [page]);

  const handleUpdate = async (row_index: number) => {
    setUpdateIndex(row_index);
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
            onClick={() => handleUpdate(row.index)}
            className="p-2 bg-blue-500 text-white rounded-md text-[24px] cursor-pointer"
          >
            <FaRegEdit />
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={data} />
      {
        <Popup isOpen={updateMode} onClose={() => setUpdateMode(false)}>
          <TextForm
            data={data[updateIndex]}
            page={page}
            refreshData={refreshData}
          />
        </Popup>
      }
    </>
  );
};

export default TextDataTable;
