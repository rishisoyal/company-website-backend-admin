"use client";
import type { TextData } from "../../../types/text.types";
import axios from "axios";
import TextDataTable from "@/components/TextDataTable";
import { MediaData } from "@/types/media.types";
import MediaDataTable from "@/components/MediaDataTabel";
import CardDataTable from "@/components/CardDataTable";
import { CardData } from "@/types/card.types";
import { useEffect, useState } from "react";
// import { useSearchParams } from "next/navigation";
import { use } from "react";

export default function Manage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; contentType?: string }>;
}) {
  const BASE_API = process.env.NEXT_PUBLIC_BASE_API;
  // console.log(await searchParams);
  const params = use(searchParams);
  const page = params.page;
  const contentType = params.contentType;
  const [data, setData] = useState<
    TextData[] | MediaData[] | CardData[] | null
  >(null);

  if (!page || !contentType) {
    return (
      <h1 className="ml-28 text-black text-6xl w-full text-center">
        Please Provide Page And Content Type
      </h1>
    );
  }

  if (!["text", "media", "card"].includes(contentType)) {
    return (
      <h1 className="ml-28 text-black text-6xl w-full text-center">
        Unknown Content Type {contentType}
      </h1>
    );
  }
  if (
    ![
      "home",
      "about",
      "solutions",
      "services",
      "industries",
      "contact",
    ].includes(page)
  ) {
    return (
      <h1 className="ml-28 text-black text-6xl w-full text-center">
        Unknown Page {page}
      </h1>
    );
  }

  async function fetchData() {
    const res = await axios.get(`${BASE_API}/api/content`, {
      withCredentials: true,
      params: {
        page,
        contentType,
      },
    });
    setData(res.data.data.content);
    console.log("response: ", res.data);
  }
  useEffect(() => {
    async function loadData() {
      await fetchData();
    }
    loadData();
  }, [page, contentType]);

  // const data: TextData[] | MediaData[] | CardData[] = res.data.data.content;

  return (
    <>
      {!data ? (
        <h1 className="text-black text-2xl">Loading...</h1>
      ) : (
        <main className="ml-12 lg:ml-64 flex flex-col items-center overflow-scroll">
          <div className="container w-full max-w-[80vw]">
            {contentType === "text" ? (
              <TextDataTable data={data as TextData[]} page={page} />
            ) : contentType === "media" ? (
              <MediaDataTable data={data as MediaData[]} page={page} />
            ) : contentType === "card" ? (
              <CardDataTable data={data as CardData[]} page={page} />
            ) : (
              <h1 className="text-9xl w-full text-center">
                Unknown content type {contentType}
              </h1>
            )}
          </div>
        </main>
      )}
    </>
  );
}
