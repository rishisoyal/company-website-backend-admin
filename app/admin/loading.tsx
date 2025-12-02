'use client'
import { TailSpin } from "react-loader-spinner";


export default function Loading() {
  return (
    <>
      <div className="flex text-black text-4xl items-center justify-center h-screen w-full ml-30">
        {/* Loading... */}
				<TailSpin/>
      </div>
    </>
  );
}
