"use client";
import { useUIStore } from "@/store/UIStore";
import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import type { TextData } from "../types/content.types";
import ToastNotification from "./ToastNotification";

type Props = {
  data: TextData;
  page: string;
  /**
   * Callback function to fetch updated data
   */
  refreshData: () => void;
};

const TextForm = ({ data, page, refreshData }: Props) => {
  const [toastNotify, setToastNotify] = useState<{
    type: "success" | "error" | "warning" | "info";
    message: string;
  } | null>(null);
  const BASE_API = process.env.NEXT_PUBLIC_BASE_API;
  const [formData, setFormData] = useState({
    title: data.title,
    subtitle: data.subtitle,
    text: data.text,
  });
  const [loading, setLoading] = useState(false);
  const [dataUpdated, setDataUpdated] = useState(false);
  const popupOpen = useUIStore((s) => s.popupOpen);
  const lockPopup = useUIStore((s) => s.lockPopup);
  const unlockPopup = useUIStore((s) => s.unlockPopup);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setFormData({ ...formData, [name]: value.trimStart() });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setToastNotify(null);
    setLoading(true);
    const res = await fetch(
      `${BASE_API}/api/content?page=${page}&contentType=text&blockType=${data.block_type}`,
      {
        method: "POST",
        body: JSON.stringify({ ...formData }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      }
    );

    if (res.status !== 201) {
      console.log("update failed");
      setToastNotify({ type: "error", message: "Could not update data" });
      return;
    }
    setToastNotify({ type: "success", message: "Successfully updated data" });
    setLoading(false);
    setDataUpdated(true);
  };

  useEffect(() => {
    if (!popupOpen && dataUpdated) {
      refreshData();
    }
  }, [popupOpen, dataUpdated]);

  useEffect(() => {
    loading ? lockPopup() : unlockPopup();
  }, [loading]);

  return (
    <>
      {toastNotify && (
        <ToastNotification
          type={toastNotify.type}
          message={toastNotify.message}
        />
      )}
      <form
        method="POST"
        onSubmit={handleSubmit}
        className="flex flex-col items-center text-sm mt-5"
      >
        <h1 className="text-2xl sm:text-4xl font-semibold text-slate-700 pb-4">
          Update {data.block_type} section
        </h1>
        <div className="flex flex-col items-center gap-8 w-fit sm:w-[700px]">
          {data.title && (
            <div className="w-full">
              <label className="text-black/70" htmlFor="title">
                Title
              </label>
              <input
                className="h-12 p-2 mt-2 w-full text-black border border-gray-500/30 rounded outline-none focus:border-indigo-300"
                type="text"
                name="title"
                value={formData.title ?? ""}
                onChange={(e) => handleChange(e)}
                required
              />
            </div>
          )}
          {data.subtitle && (
            <div className="w-full">
              <label className="text-black/70" htmlFor="subtitle">
                Subtitle
              </label>
              <input
                className="h-12 p-2 mt-2 w-full border text-black border-gray-500/30 rounded outline-none focus:border-indigo-300"
                type="text"
                name="subtitle"
                value={formData.subtitle ?? ""}
                onChange={(e) => handleChange(e)}
                required
              />
            </div>
          )}
          {data.text && (
            <div className="w-full">
              <label className="text-black/70" htmlFor="footer-text">
                Text
              </label>
              <textarea
                className="w-full text-black mt-2 p-2 h-40 border border-gray-500/30 rounded resize-none outline-none focus:border-indigo-300"
                name="text"
                value={formData.text ?? ""}
                onChange={(e) => handleChange(e)}
              ></textarea>
            </div>
          )}
        </div>
        <button
          type="submit"
          className={`mt-5 bg-indigo-600 text-white h-12 w-56 px-4 rounded active:scale-95 transition cursor-pointer disabled:pointer-events-none hover:scale-105 flex items-center justify-center`}
          disabled={loading}
        >
          {loading ? <ThreeDots /> : "Update"}
        </button>
      </form>
    </>
  );
};

export default TextForm;
