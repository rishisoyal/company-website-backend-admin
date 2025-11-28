"use client";
import { MRT_ColumnDef } from "material-react-table";
import DataTable from "./DataTable";
import { useEffect, useState } from "react";
import MediaForm from "./MediaForm";
import type { MediaData } from "@/types/media.types";
import Image from "next/image";
import Popup from "./PopUp";
import { ThreeDots } from "react-loader-spinner";

const MediaDataTable = ({
	data,
	page,
}: {
	data: MediaData[];
	page?: string;
}) => {
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
	const columns: MRT_ColumnDef<MediaData>[] = [
		// { accessorKey: "_id", header: "ID" },
		{ accessorKey: "block_type", header: "Block Type" },
		{
			header: "Media",
			Cell: ({ row }) => (
				<div className="flex gap-2">
					{row.original.media_path ? (
						<Image
							width={200}
							height={20}
							src={row.original.media_path!}
							alt="media"
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
				<Popup isOpen={updateMode} onClose={() => setUpdateMode(false)}>
					<MediaForm data={data[updateIndex]} page={page} />
				</Popup>
			}
		</>
	);
};

export default MediaDataTable;
