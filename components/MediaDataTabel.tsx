"use client";
import { useUIStore } from "@/store/UIStore";
import type { MediaData } from "@/types/content.types";
import { MRT_ColumnDef } from "material-react-table";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import DataTable from "./DataTable";
import MediaForm from "./MediaForm";
import Popup from "./PopUp";

type Props = {
  data: MediaData[];
  page: string;
  /**
   * Callback function to fetch updated data
   */
  refreshData: () => void;
};

const MediaDataTable = ({ data, page, refreshData }: Props) => {
  const [selectedRow, setSelectedRow] = useState<MediaData | null>(null);
  const popupOpen = useUIStore((s) => s.popupOpen);
  const openPopup = useUIStore((s) => s.openPopup);

  useEffect(() => {
    if (popupOpen) {
      openPopup();
      setSelectedRow(null);
    }
  }, [page]);

  const handleUpdate = (row: MediaData) => {
    console.log("OPEN POPUP");
    openPopup();
    setSelectedRow(row);
  };
  const columns: MRT_ColumnDef<MediaData>[] = [
    { accessorKey: "block_type", header: "Block Type" },
    {
      header: "Media",
      Cell: ({ row }) => (
        <div className="flex gap-2">
          {row.original.media_path && (
            <video
              width={200}
              autoPlay={true}
              muted={true}
              loop={true}
              preload="auto"
              poster="../loading.gif"
              playsInline={true}
              src={row.original.media_path!}
              className="max-w-50 max-h-30 object-cover bg-transparent"
            />
          )}
        </div>
      ),
    },
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
          <MediaForm data={selectedRow} page={page} refreshData={refreshData} />
        )}
      </Popup>
    </>
  );
};

export default MediaDataTable;
