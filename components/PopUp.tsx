"use client";
import { useUIStore } from "@/store/UIStore";
import { AnimatePresence, motion } from "framer-motion";
import { IoCloseCircleOutline } from "react-icons/io5";

type Props = {
  children: React.ReactNode;
};

export default function Popup({ children }: Props) {
  const popupOpen = useUIStore((s) => s.popupOpen);
  const setPopupOpen = useUIStore((s) => s.setPopupOpen);
  console.log({ popupOpen });

  return (
    <AnimatePresence>
      {popupOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-999"
            onClick={() => setPopupOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Popup Wrapper */}
          <motion.div
            className="fixed inset-0 z-999 flex flex-col items-center justify-center p-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={() => setPopupOpen(false)}
          >
            {/* Content Box */}
            <div className="w-max relative">
              <div
                className="bg-white rounded-2xl p-12 shadow-xl max-w-max w-full max-h-[80vh] overflow-y-auto ml-34"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-full flex items-center justify-end left-0 absolute top-0 p-2">
                  <button
                    onClick={() => setPopupOpen(false)}
                    className="cursor-pointer p-2 rounded-full text-black opacity-70 hover:opacity-100 duration-300"
                  >
                    <IoCloseCircleOutline size={40} />
                  </button>
                </div>
                {children}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
