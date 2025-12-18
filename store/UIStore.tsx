import { create } from "zustand";

type UIStore = {
  popupOpen: boolean;
  popupLocked: boolean;

  /**
   * sets popupOnep to true
   */
  openPopup: () => void;
  /**
   * sets popupOpen to false
   */
  closePopup: () => void;

  /**
   * sets popupLocked to true
   */
  lockPopup: () => void;
  /**
   * sets popupLocked to false
   */
  unlockPopup: () => void;
};

export const useUIStore = create<UIStore>((set, get) => ({
  popupOpen: false,
  popupLocked: false,

  openPopup: () =>
    set({
      popupOpen: true,
      popupLocked: false,
    }),

  closePopup: () => {
    if (get().popupLocked) return; // BLOCK CLOSE
    set({ popupOpen: false });
  },

  lockPopup: () => set({ popupLocked: true }),
  unlockPopup: () => set({ popupLocked: false }),
}));
