"use client";
import axios from "axios";
import React, { useState } from "react";
import type { MediaData } from "../types/content.types";
import ToastNotification from "./ToastNotification";

type Props = {
  data: MediaData;
  page: string;
  /**
   * Callback function to fetch updated data
   */
  refreshData: () => void;
};

export default function MediaForm({ data, page, refreshData }: Props) {
  const [toastType, setToastType] = useState<
    "success" | "error" | "warning" | "info"
  >();
  const BASE_API = process.env.NEXT_PUBLIC_BASE_API;
  const [mediaPath, setMediaPath] = useState(data.media_path);
  const [file, setFile] = useState<File | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!file) {
      await toggleToastNotification("error");
      return;
    }

    const formData = new FormData();
    formData.set("media", file!);

    const res = await axios.post(`${BASE_API}/api/content`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      params: {
        page,
        contentType: "media",
        blockType: data.block_type,
      },
    });

    console.log(res);
    if (res.status !== 200) {
      console.log("update failed");
      await toggleToastNotification("error");
      return;
    }
    await toggleToastNotification("success");
    refreshData();
  }

	 async function toggleToastNotification(
    type: "success" | "error" | "warning" | "info"
  ) {
    setToastType(type);
    setTimeout(() => {
      setToastType(undefined);
    }, 3000);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.currentTarget.files![0]);
    setMediaPath(URL.createObjectURL(e.currentTarget.files![0]));
  }

  return (
    <>
      {toastType === "success" ? (
        <ToastNotification type="success" message="Successfully updated data" />
      ) : toastType === "error" ? (
				<>
        <ToastNotification type="error" message="Could not updated data" />
				{/* {setToastType(null)} */}
				</>
      ) : (
        ""
      )}
      <form
        method="POST"
        onSubmit={handleSubmit}
        className="flex flex-col items-center text-sm mt-5"
      >
        <h1 className="text-4xl font-semibold text-slate-700 pb-4">
          Update {data.block_type} section
        </h1>
        <div className="flex flex-col items-center gap-8 w-[350px] md:w-[700px]">
          <div className="preview">
            {mediaPath && (
              <video
                autoPlay={true}
                muted={true}
                loop={true}
                playsInline={true}
                preload="auto"
                poster="../loading.png"
                width={500}
                height={400}
                src={mediaPath!}
                className="max-w-100 max-h-70 object-cover bg-transparent"
              />
            )}
          </div>
          <div className="w-full flex flex-col items-center justify-center">
            <label
              htmlFor="media"
              className="flex items-center justify-center w-max p-4 cursor-pointer border-2 rounded-xl text-black font-bold text-xl hover:text-white hover:bg-black transition-all duration-200"
            >
              Choose a file
            </label>
            <input
              className="hidden"
              accept="video/webm"
              type="file"
              name="media"
              id="media"
              onChange={(e) => handleChange(e)}
            />
          </div>
        </div>
        <button
          type="submit"
          className="mt-5 bg-indigo-600 text-white h-12 w-56 px-4 rounded active:scale-95 transition cursor-pointer hover:scale-105"
        >
          Update
        </button>
      </form>
    </>
  );
}
