let activeRequests = 0;
let nprogress: any = null;

async function getNProgress() {
  if (!nprogress) {
    nprogress = (await import("nprogress")).default;
    nprogress.configure({
      showSpinner: false,
      trickle: true,
      trickleSpeed: 120,
      minimum: 0.08,
    });
  }
  return nprogress;
}

export async function startRequest() {
  const np = await getNProgress();
  if (activeRequests === 0) {
    np.start();
  }
  activeRequests++;
}

export async function endRequest() {
  const np = await getNProgress();
  activeRequests--;
  if (activeRequests <= 0) {
    activeRequests = 0;
    np.done();
  }
}
