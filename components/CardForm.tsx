"use client";
import { CardData } from "@/types/content.types";
import axios from "axios";
import React, { useState } from "react";

type Props = {
  data: CardData;
  page: string;
};

const CardForm = ({ data, page }: Props) => {
  const BASE_API = process.env.NEXT_PUBLIC_BASE_API;
  const [cardData, setCardData] = useState(data.cards);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>,
    card_index: number,
    point_index?: number
  ) {
    const { name, value } = e.target;

    setCardData((prev) => {
      const updated = [...prev]; // shallow copy array
      if (name === "more_info.heading") {
        updated[card_index].more_info!.heading = value;
        return updated;
      } else if (name === "more_info.point") {
        updated[card_index].more_info!.points[point_index!] = value;
        return updated;
      }
      updated[card_index] = { ...updated[card_index], [name]: value }; // copy object
      return updated;
    });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await axios.post(
      `${BASE_API}/api/content`,
      {
        cards: cardData,
      },
      {
        params: {
          page,
          contentType: "card",
          blockType: data.block_type,
        },
      }
    );

    console.log(res);
    if (res.status !== 201) {
      console.log("update failed");
      return;
    }
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
          {cardData.map((card, c_index) => (
            <div
              key={card._id}
              className="w-full border-2 border-black p-4 rounded-2xl"
            >
              <strong className="text-black w-full block text-center">
                Card - {c_index + 1}
              </strong>
              {card.title && (
                <div className="w-full">
                  <label className="text-black/70" htmlFor="title">
                    Title
                  </label>
                  <input
                    className="h-12 p-2 mt-2 w-full text-black border border-gray-500/30 rounded outline-none focus:border-indigo-300"
                    type="text"
                    name="title"
                    value={card.title}
                    onChange={(e) => handleChange(e, c_index)}
                    required
                  />
                </div>
              )}
              {card.subtitle && (
                <div className="w-full">
                  <label className="text-black/70" htmlFor="subtitle">
                    Subtitle
                  </label>
                  <input
                    className="h-12 p-2 mt-2 w-full border text-black border-gray-500/30 rounded outline-none focus:border-indigo-300"
                    type="text"
                    name="subtitle"
                    value={card.subtitle}
                    onChange={(e) => handleChange(e, c_index)}
                    required
                  />
                </div>
              )}
              {card.more_info && (
                <div className="w-full">
                  <label className="text-black/70" htmlFor="subtitle">
                    More Info Heading
                  </label>
                  <input
                    className="h-12 p-2 mt-2 w-full border text-black border-gray-500/30 rounded outline-none focus:border-indigo-300"
                    type="text"
                    name="more_info.heading"
                    value={card.more_info.heading}
                    onChange={(e) => handleChange(e, c_index)}
                    required
                  />
                  <label className="text-black/70" htmlFor="subtitle">
                    Points
                  </label>
                  {card.more_info.points.map((point, p_index) => (
                    <input
                      key={p_index}
                      className="h-12 p-2 mt-2 w-full border text-black border-gray-500/30 rounded outline-none focus:border-indigo-300"
                      type="text"
                      name="more_info.point"
                      value={point}
                      onChange={(e) => handleChange(e, c_index, p_index)}
                      required
                    />
                  ))}
                </div>
              )}
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
