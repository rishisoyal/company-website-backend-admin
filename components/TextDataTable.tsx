"use client";
import { MRT_ColumnDef } from "material-react-table";
import { TextData } from "@/types/text.types";
import DataTable from "./DataTable";
import { useEffect, useState } from "react";
import TextForm from "./TextForm";
import Popup from "./PopUp";

const TextDataTable = ({ data, page }: { data: TextData[]; page?: string }) => {
  const [updateIndex, setUpdateIndex] = useState(0);
  const [updateMode, setUpdateMode] = useState(false);

  useEffect(() => {
    setUpdateMode(false);
  }, [page]);

  const handleUpdate = async (row_index: number) => {
    setUpdateIndex(row_index);
    setUpdateMode(true);
    // console.log(textData[updateIndex]);
  };
  const columns: MRT_ColumnDef<TextData>[] = [
    // { accessorKey: "_id", header: "ID" },
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
            className="px-4 py-1 bg-blue-500 text-white rounded-md text-[18px] cursor-pointer"
          >
            Update
          </button>
        </div>
      ),
    },
  ];

  return (
    <>
      <DataTable columns={columns} data={data} />
      {
        <Popup isOpen={updateMode} onClose={()=>setUpdateMode(false)}>
          <TextForm data={data[updateIndex]} page={page} />
        </Popup>
      }
    </>
  );
};

export default TextDataTable;
