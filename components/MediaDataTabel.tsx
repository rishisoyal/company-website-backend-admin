"use client";
import type { MediaData } from "@/types/content.types";
import { MRT_ColumnDef } from "material-react-table";
import Image from "next/image";
import { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import DataTable from "./DataTable";
import MediaForm from "./MediaForm";
import Popup from "./PopUp";
import { FaRegEdit } from "react-icons/fa";

type Props = {
  data: MediaData[];
  page: string;
	/**
	 * Callback function to fetch updated data
	 */
  refreshData: () => void;
};

const MediaDataTable = ({ data, page, refreshData }: Props) => {
  const [updateIndex, setUpdateIndex] = useState(0);
  const [updateMode, setUpdateMode] = useState(false);

  useEffect(() => {
    setUpdateMode(false);
  }, [page]);

  const handleUpdate = async (row_index: number) => {
    setUpdateIndex(row_index);
    setUpdateMode(true);
  };
  const columns: MRT_ColumnDef<MediaData>[] = [
    { accessorKey: "block_type", header: "Block Type" },
    {
      header: "Media",
      Cell: ({ row }) => (
        <div className="flex gap-2">
          {row.original.media_path ? (
            <video
              width={200}
              height={20}
							autoPlay={true}
        muted={true}
        loop={true}
        playsInline={true}
              src={row.original.media_path!}
            />
          ) : (
            <ThreeDots
              height="80"
              width="80"
              radius="9"
              color="#4fa94d"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              visible={true}
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
            onClick={() => handleUpdate(row.index)}
            className="p-2 bg-blue-500 text-white rounded-md text-[24px] cursor-pointer"
          >
            <FaRegEdit/>
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
          <MediaForm data={data[updateIndex]} page={page} refreshData={refreshData} />
        </Popup>
      }
    </>
  );
};

export default MediaDataTable;
