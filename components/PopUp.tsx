"use client";
import { AnimatePresence, motion } from "framer-motion";

type Props = {
  isOpen: boolean;
  onClose: any;
  children: React.ReactNode;
};

export default function Popup({ isOpen, onClose, children }: Props) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background Overlay */}
          <motion.div
            className="fixed inset-0 bg-black/40 backdrop-blur-md z-40"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Popup Wrapper */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={onClose}
          >
            {/* Content Box */}
            <div
              className="bg-white rounded-2xl p-12 shadow-xl max-w-max w-full max-h-[80vh] overflow-y-auto ml-34"
              onClick={(e) => e.stopPropagation()}
            >
              {children}

              {/* <div className="w-full flex place-content-center">
                <button
                  onClick={onClose}
                  className="mt-4 w-24 cursor-pointer py-2 rounded-lg bg-black text-white active:scale-95 hover:scale-105 duration-300"
                >
                  Close
                </button>
              </div> */}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
