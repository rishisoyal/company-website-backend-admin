import { startRequest, endRequest } from "./progress";

export async function fetchWithProgress(
  input: RequestInfo,
  init?: RequestInit
) {
  await startRequest();
  try {
    return await fetch(input, init);
  } finally {
    await endRequest();
  }
}
