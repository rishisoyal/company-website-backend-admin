"use client";
import React, { useEffect, useState } from "react";
import type { TextData } from "../types/text.types";
import axios from "axios";

const TextForm = ({ data, page }: { data: TextData; page: string }) => {
  const BASE_API = process.env.NEXT_PUBLIC_BASE_API;
  const [formData, setFormData] = useState({
    title: data.title,
    subtitle: data.subtitle,
    text: data.text,
  });

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    console.log(name, value);

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // console.log(formData);
    e.preventDefault();

    const res = await axios.post(
      `${BASE_API}/api/content?page=${page}&blockType=${data.block_type}&contentType=text`,
      {
        ...formData,
      }
    );

    console.log(res);
    if (res.status !== 201) {
      console.log("update failed");
      return;
    }
  };

  return (
    <>
      <form
        method="POST"
        onSubmit={handleSubmit}
        className="flex flex-col items-center text-sm mt-5"
      >
        <h1 className="text-2xl sm:text-4xl font-semibold text-slate-700 pb-4">
          Update {data.block_type} section
        </h1>
        <div className="flex flex-col items-center gap-8 w-fit sm:w-[700px]">
          <div className="w-full">
            <label className="text-black/70" htmlFor="title">
              Title
            </label>
            <input
              className="h-12 p-2 mt-2 w-full text-black border border-gray-500/30 rounded outline-none focus:border-indigo-300"
              type="text"
              name="title"
              disabled={formData.title ? false : true}
              value={formData.title ?? ""}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          <div className="w-full">
            <label className="text-black/70" htmlFor="subtitle">
              Subtitle
            </label>
            <input
              className="h-12 p-2 mt-2 w-full border text-black border-gray-500/30 rounded outline-none focus:border-indigo-300"
              type="text"
              name="subtitle"
              disabled={formData.subtitle ? false : true}
              value={formData.subtitle ?? ""}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
          <div className="w-full">
            <label className="text-black/70" htmlFor="footer-text">
              Text
            </label>
            <textarea
              className="w-full text-black mt-2 p-2 h-40 border border-gray-500/30 rounded resize-none outline-none focus:border-indigo-300"
              name="text"
              disabled={formData.text ? false : true}
              value={formData.text ?? ""}
              onChange={(e) => handleChange(e)}
            ></textarea>
          </div>
        </div>
        <button
          type="submit"
          className="mt-5 bg-indigo-600 text-white h-12 w-56 px-4 rounded active:scale-95 transition cursor-pointer"
        >
          Update
        </button>
      </form>
    </>
  );
};

export default TextForm;
