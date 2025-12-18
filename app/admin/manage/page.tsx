"use client";
import CardDataTable from "@/components/CardDataTable";
import MediaDataTable from "@/components/MediaDataTabel";
import TextDataTable from "@/components/TextDataTable";
import { fetchWithProgress } from "@/lib/fetchWithProgress";
import { CardData, MediaData, TextData } from "@/types/content.types";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { TailSpin } from "react-loader-spinner";

export default function Manage() {
  const BASE_API = process.env.NEXT_PUBLIC_BASE_API;
  const searchParams = useSearchParams();
  const page = searchParams.get("page");
  const contentType = searchParams.get("contentType");
  const [data, setData] = useState<
    TextData[] | MediaData[] | CardData[] | null
  >(null);
  const [loading, setLoading] = useState(true);

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

  const fetchData = useCallback(async () => {
    setLoading(true);

    const res = await fetchWithProgress(
      `${BASE_API}/api/content?page=${page}&contentType=${contentType}`,
      { credentials: "include" }
    );

    setData((await res.json()).data.content);
    setLoading(false);
  }, [BASE_API, page, contentType]);

  useEffect(() => {
    async function loadData() {
      await fetchData();
    }
    loadData();
  }, [page, contentType]);

  const contentDataTables: Record<string, React.ReactNode> = {
    text: (
      <TextDataTable
        data={data as TextData[]}
        page={page}
        refreshData={async () => await fetchData()}
      />
    ),
    media: (
      <MediaDataTable
        data={data as MediaData[]}
        page={page}
        refreshData={async () => await fetchData()}
      />
    ),
    card: (
      <CardDataTable
        data={data as CardData[]}
        page={page}
        refreshData={async () => await fetchData()}
      />
    ),
  };

  return (
    <>
      <main className="ml-12 lg:ml-64 flex flex-col items-center overflow-scroll relative justify-center">
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
            <TailSpin />
          </div>
        )}

        <div className="container w-full max-w-[80vw] animate__animated animate__fadeIn">
          {contentDataTables[contentType]}
        </div>
      </main>
    </>
  );
}
