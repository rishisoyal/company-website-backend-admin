import { startRequest, endRequest } from "./progress";
import { useUIStore } from "@/store/UIStore";

export async function fetchWithProgress(
  input: RequestInfo,
  init?: RequestInit
) {
  const { popupOpen } = useUIStore.getState();

  if (!popupOpen) await startRequest();

  try {
    return await fetch(input, init);
  } finally {
    if (!popupOpen) await endRequest();
  }
}
