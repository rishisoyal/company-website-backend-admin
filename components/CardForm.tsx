"use client";
import React, { useState, useEffect } from "react";
import { CardData } from "@/types/card.types";
import axios from "axios";

const CardForm = ({ data, page }: { data: CardData; page?: string }) => {
  const BASE_API = process.env.NEXT_PUBLIC_BASE_API;
  const [cardData, setCardData] = useState(data.cards);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, i: number) => {
    const { name, value } = e.target;

    setCardData((prev) => {
      const updated = [...prev]; // shallow copy array
      updated[i] = { ...updated[i], [name]: value }; // copy object
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // console.log(formData);
    e.preventDefault();
    const res = await axios.post(
      `${BASE_API}/api/content?page=${page}&blockType=${data.block_type}&contentType=card`,
      {
        cards: cardData,
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
        <h1 className="text-4xl font-semibold text-slate-700 pb-4">
          Update {data.block_type} section
        </h1>
        <div className="flex flex-col items-center gap-8 w-[350px] md:w-[700px]">
          {cardData.map((card, index) => (
            <div
              key={card._id}
              className="w-full border-2 border-black p-4 rounded-2xl"
            >
              <strong className="text-black w-full block text-center">
                Card - {index + 1}
              </strong>
              <div className="w-full">
                <label className="text-black/70" htmlFor="title">
                  Title
                </label>
                <input
                  className="h-12 p-2 mt-2 w-full text-black border border-gray-500/30 rounded outline-none focus:border-indigo-300"
                  type="text"
                  name="title"
                  disabled={cardData[index].title ? false : true}
                  value={cardData[index].title}
                  onChange={(e) => handleChange(e, index)}
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
                  disabled={cardData[index].subtitle ? false : true}
                  value={cardData[index].subtitle}
                  onChange={(e) => handleChange(e, index)}
                  required
                />
              </div>
            </div>
          ))}
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

export default CardForm;
