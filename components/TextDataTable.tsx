"use client";
import { useUIStore } from "@/store/UIStore";
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
  const [selectedRow, setSelectedRow] = useState<TextData | null>(null);
  const popupOpen = useUIStore((s) => s.popupOpen);
  const openPopup = useUIStore((s) => s.openPopup);

  useEffect(() => {
    if (popupOpen) {
      openPopup();
      setSelectedRow(null);
    }
  }, [page]);

  const handleUpdate = (row: TextData) => {
    console.log("OPEN POPUP");
    openPopup();
    setSelectedRow(row);
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
            className="p-2 bg-blue-500 text-white cursor-pointer rounded-md text-[24px]"
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
      <Popup>
        {selectedRow && (
          <TextForm data={selectedRow} page={page} refreshData={refreshData} />
        )}
      </Popup>
    </>
  );
};

export default TextDataTable;
