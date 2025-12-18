import { startRequest, endRequest } from "./progress";
import { useUIStore } from "@/store/UIStore";

export async function fetchWithProgress(
  input: RequestInfo,
  init?: RequestInit
) {
  const {popupOpen} = useUIStore.getState();
  // const popupOpen = useUIStore((s) => s.popupOpen);

  if (!popupOpen) await startRequest();

  try {
    return await fetch(input, init);
  } finally {
    if (!popupOpen) await endRequest();
  }
}
