"use client";
import { CardData } from "@/types/content.types";
import { Disclosure } from "@headlessui/react";
import { MRT_ColumnDef } from "material-react-table";
import { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import CardForm from "./CardForm";
import DataTable from "./DataTable";
import Popup from "./PopUp";

type Props = {
  data: CardData[];
  page: string;
  /**
   * Callback function to fetch updated data
   */
  refreshData: () => void;
};

const CardDataTable = ({ data, page, refreshData }: Props) => {
  const [updateIndex, setUpdateIndex] = useState(0);
  const [updateMode, setUpdateMode] = useState(false);

  useEffect(() => {
    setUpdateMode(false);
  }, [page]);

  const handleUpdate = async (row_index: number) => {
    setUpdateIndex(row_index);
    setUpdateMode(true);
  };
  const columns: MRT_ColumnDef<CardData>[] = [
    { accessorKey: "block_type", header: "Block Type" },
    {
      header: "Cards",
      Cell: ({ row }) => {
        const cards = row.original.cards ?? [];

        return (
          <Disclosure>
            {({ open }) => (
              <div className="w-full">
                <Disclosure.Button className="flex w-full items-center justify-between rounded bg-gray-200 px-3 py-2 text-left text-sm font-medium hover:bg-gray-300">
                  <span>{cards.length} Cards</span>
                  <span>{open ? "▲" : "▼"}</span>
                </Disclosure.Button>

                <Disclosure.Panel className="mt-2 rounded border bg-gray-50 p-3 space-y-3">
                  {cards.map((card) => (
                    <div
                      key={card._id}
                      className="rounded border p-2 bg-white shadow-sm"
                    >
                      {card.title && (
                        <div>
                          <strong>Title:</strong> {card.title}
                        </div>
                      )}
                      {card.subtitle && (
                        <div>
                          <strong>Subtitle:</strong> {card.subtitle}
                        </div>
                      )}
                      {card.more_info && (
                        <div>
                          <b>{card.more_info.heading}</b>
                          <ul>
                            {card.more_info.points.map((point) => (
                              <li key={point}>▪️{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </Disclosure.Panel>
              </div>
            )}
          </Disclosure>
        );
      },
    },
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
          <CardForm
            data={data[updateIndex]}
            page={page!}
            refreshData={refreshData}
          />
        </Popup>
      }
    </>
  );
};

export default CardDataTable;
