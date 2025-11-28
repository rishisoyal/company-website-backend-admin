"use client";
import React, { useEffect, useState } from "react";
import type { MediaData } from "../types/media.types";
import axios from "axios";
import Image from "next/image";
import { FileUpload } from "primereact/fileupload";
import { ThreeDots } from "react-loader-spinner";

const MediaForm = ({ data, page }: { data: MediaData; page?: string }) => {
  const BASE_API = process.env.NEXT_PUBLIC_BASE_API;
  const [mediaPath, setMediaPath] = useState(data.media_path);
  const [file, setFile] = useState<File | null>(null);

  const updateFormData = async () => {
			setMediaPath(data.media_path);
		};
	
		useEffect(() => {
			const load = async () => {
				await updateFormData();
			};
			load();
		}, [data]);

  const handleSubmit = async (e:React.FormEvent<HTMLFormElement>) => {
    // console.log(formData);
		e.preventDefault()
    const formData = new FormData();
    formData.set("media", file!);

    const res = await axios.post(
      `${BASE_API}/api/content?page=${page}&blockType=${data.block_type}&contentType=media`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );

    console.log(res);
    if (res.status !== 201) {
      console.log("update failed");
      return;
    }
  };

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFile(e.currentTarget.files![0]);
    setMediaPath(URL.createObjectURL(e.currentTarget.files![0]));
  }

  return (
    <>
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
          {mediaPath? 
            <Image
              width={500}
              height={400}
              src={mediaPath!}
              alt="Image Preview"
            />
          : 	<ThreeDots
							height="80"
							width="80"
							radius="9"
							color="#4fa94d"
							ariaLabel="three-dots-loading"
							wrapperStyle={{}}
							visible={true}
						/>}
          </div>
          <div className="w-full flex flex-col items-center justify-center">
            {/* <label className="text-black/70" htmlFor="title">
              Media
            </label> */}
            <input
              className="h-12 p-2 mt-2 text-black border-black rounded-2xl outline-none focus:border-indigo-300 cursor-pointer w-2xs text-center shadow-2xl border-2"
              type="file"
              name="media"
							placeholder="Choose"
              // disabled={formData.title ? false : true}
              // value={mediaPath}
              onChange={(e) => handleChange(e)}
              required
            />
          </div>
        </div>
      <button
        // type="submit"
        className="mt-5 bg-indigo-600 text-white h-12 w-56 px-4 rounded active:scale-95 transition cursor-pointer"
      >
        Update
      </button>
      </form>
    </>
  );
};

export default MediaForm;
