import { create } from 'zustand'

type UIState = {
  popupOpen: boolean
  setPopupOpen: (open: boolean) => void
}

export const useUIStore = create<UIState>((set) => ({
  popupOpen: false,
  setPopupOpen: (open) => set({ popupOpen: open }),
}))
