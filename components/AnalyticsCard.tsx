import React from "react";

export default function AnalyticsCard({
  title,
  data,
}: {
  title: string;
  data: string;
}) {
  return (
    <>
      <div className="card bg-[#181825] text-2xl rounded-xl min-w-40 w-full p-6">
        <h2 className="text-white">{title}</h2>
        <p className="text-white">{data}</p>
      </div>
    </>
  );
}
