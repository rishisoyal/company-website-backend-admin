"use client";
import CardDataTable from "@/components/CardDataTable";
import MediaDataTable from "@/components/MediaDataTabel";
import TextDataTable from "@/components/TextDataTable";
import { CardData, MediaData, TextData } from "@/types/content.types";
import axios from "axios";
import { useEffect, useState } from "react";
import { use } from "react";
import { TailSpin } from "react-loader-spinner";

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
  }
  useEffect(() => {
    setData(null);
    async function loadData() {
      await fetchData();
    }
    loadData();
  }, [page, contentType]);

  const contentDataTables: Record<string, React.ReactNode> = {
    text: <TextDataTable data={data as TextData[]} page={page} />,
    media: <MediaDataTable data={data as MediaData[]} page={page} />,
    card: <CardDataTable data={data as CardData[]} page={page} />,
  };

  return (
    <>
      {!data ? (
        <div className="flex text-black text-4xl items-center justify-center h-screen w-full ml-30">
          {/* Loading... */}
					<TailSpin/>
        </div>
      ) : (
        <main className="ml-12 lg:ml-64 flex flex-col items-center overflow-scroll">
          <div className="container w-full max-w-[80vw]">
            {contentDataTables[contentType]}
          </div>
        </main>
      )}
    </>
  );
}
